'use client';
import {useRouter} from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', {method: 'POST'});
        router.push('/login');
    };

    return <button onClick={handleLogout} style={{position: 'absolute', top: 20, right: 20}}>Logout</button>;
}