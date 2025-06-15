'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (res.ok) {
                // Redirect to the admin dashboard on successful login
                router.push('/admin/manage');
            } else {
                const data = await res.json();
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white'}}
              className="bg-black">
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '2rem',
                border: '1px solid #444',
                borderRadius: '8px'
            }}>
                <h1>Admin Login</h1>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{width: '100%', color: 'black'}}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width: '100%', color: 'black'}}
                    />
                </div>
                {error && <p style={{color: '#dc3545'}}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </main>
    );
}