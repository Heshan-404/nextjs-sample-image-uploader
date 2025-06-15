import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

export async function POST(request) {
    // Delete the session cookie
    cookies().delete('auth_session');
    return NextResponse.json({message: 'Logout successful'}, {status: 200});
}