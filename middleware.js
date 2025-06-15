import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

// This function will run for every request that matches the `matcher` config
export function middleware(request) {
    // Get the session cookie
    const sessionCookie = cookies().get('auth_session');

    // If there is no session cookie, the user is not logged in
    if (!sessionCookie) {
        // Redirect them to the login page
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If the cookie exists, allow the request to proceed
    return NextResponse.next();
}

// The matcher config specifies which paths the middleware should run on
export const config = {
    matcher: [
        '/admin',         // Protects the /admin route
        '/admin/:path*',  // Protects all sub-routes under /admin (e.g., /admin/manage)
    ],
};