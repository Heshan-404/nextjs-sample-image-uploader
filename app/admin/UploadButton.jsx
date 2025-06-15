'use client';
import {useRouter} from 'next/navigation';

export default function UploadButton() {
    const router = useRouter();

    const handleUpload = async () => {
        router.push('/admin');
    };

    return <button onClick={handleUpload} style={{position: '', top: 20, right: 20}}>NEW</button>;
}