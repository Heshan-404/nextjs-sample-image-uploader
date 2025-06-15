import {list} from '@vercel/blob';

// This is a Server Component, so we can make it async and fetch data directly.
export default async function Home() {
    // 1. Fetch the list of blobs from Vercel Blob
    const {blobs} = await list();

    return (
        <main style={{padding: 20}}>
            <h1>My Portfolio Gallery</h1>
            <p>
                These images are served directly from Vercel Blob storage.
            </p>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem'
                }}
            >
                {/* 2. Map over the blobs and render an img tag for each one */}
                {blobs.map((blob) => (
                    <div key={blob.pathname}>
                        <img
                            src={blob.url}
                            alt={blob.pathname}
                            style={{width: '100%', height: 'auto', objectFit: 'cover'}}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}

// Optional: To ensure the page is always up-to-date
export const revalidate = 60; // Re-fetch data every 60 seconds
// Or for completely dynamic rendering on every request:
// export const dynamic = 'force-dynamic';