'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setMessage('');
    setImageUrl('');

    // We pass the filename in the URL search params
    const res = await fetch(`/api/upload?filename=${file.name}`, {
      method: 'POST',
      body: file, // The file object itself is the body
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Upload complete!');
      // The response 'data' is the blob object from Vercel
      setImageUrl(data.url);
    } else {
      setMessage(`Upload failed: ${data.error || 'Unknown error'}`);
    }

    setIsUploading(false);
  };

  return (
      <main style={{ padding: 20 }}>
        <h1>Admin Upload</h1>
        <form onSubmit={uploadImage}>
          <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0])}
          />
          <button type="submit" disabled={!file || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {message && <p>{message}</p>}
        {imageUrl && (
            <div>
              <p>Image successfully uploaded!</p>
              <img src={imageUrl} alt="Uploaded preview" width="300" />
              <p>URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
            </div>
        )}
      </main>
  );
}