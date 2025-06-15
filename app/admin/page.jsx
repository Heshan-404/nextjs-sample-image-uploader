'use client';
import {useState} from 'react';
import ManageButton from "./ManageButton";
import LogoutButton from "./LogoutButton";

const CATEGORIES = [
    "logo-design",
    "t-shirt-design",
    "social-media",
    "poster-design",
    "cover-page",
    "brand-identity",
    "3d-design",
    "other-design"
];

export default function AdminPage() {
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState(CATEGORIES[0]); // Default to the first category
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (e) => {
        e.preventDefault();
        if (!file || !category) {
            setMessage('Please select a file and a category.');
            return;
        }

        setIsUploading(true);
        setMessage('');

        // Pass filename AND category as search params
        const res = await fetch(`/api/upload?filename=${file.name}&category=${category}`, {
            method: 'POST',
            body: file,
        });

        const data = await res.json();
        setIsUploading(false);

        if (res.ok) {
            setMessage(`Upload complete! Image URL: ${data.url}`);
        } else {
            setMessage(`Upload failed: ${data.message || 'Unknown error'}`);
        }
    };

    return (
        <main style={{padding: 20, color: 'white'}} className={"bg-black vh-100"}>
            <LogoutButton/>
            <ManageButton/>
            <h1>Admin Upload</h1>
            <form onSubmit={uploadImage}
                  style={{display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px'}}>
                <div>
                    <label htmlFor="file-upload">Choose Image:</label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0])}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category-select">Choose Category:</label>
                    <select
                        id="category-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={{color: 'black'}}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat.replace('-', ' ').toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={!file || isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </form>
            {message && <p style={{marginTop: '1rem'}}>{message}</p>}
        </main>
    );
}