import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const {username, password} = body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if the provided credentials match the environment variables
    if (username === adminUsername && password === adminPassword) {
        // Set a secure, HTTP-only cookie to establish a session
        cookies().set('auth_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day in seconds
            path: '/',
            sameSite: 'strict',
        });

        return NextResponse.json({message: 'Login successful'}, {status: 200});
    }

    // If credentials do not match, return an error
    return NextResponse.json({message: 'Invalid username or password'}, {status: 401});
}