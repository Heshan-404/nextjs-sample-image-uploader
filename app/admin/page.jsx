'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const uploadImage = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setMessage(data.message || 'Upload complete');
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Admin Upload</h1>
      <form onSubmit={uploadImage}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
