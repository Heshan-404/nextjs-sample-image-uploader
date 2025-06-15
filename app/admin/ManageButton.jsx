'use client';
import {useRouter} from 'next/navigation';

export default function ManageButton() {
    const router = useRouter();

    const handleManage = async () => {
        router.push('/admin/manage');
    };

    return <button onClick={handleManage} style={{position: 'absolute', top: 20, right: 20}}>Manage</button>;
}