import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import path from 'path'; // 1. Import the Node.js 'path' module to easily get file extensions

const prisma = new PrismaClient();

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    // Get the original filename from the client
    const originalFilename = searchParams.get('filename');

    if (!originalFilename || !category || !request.body) {
        return NextResponse.json({ message: 'Missing filename, category, or file body.' }, { status: 400 });
    }

    try {
        // --- NEW LOGIC TO GENERATE A UNIQUE FILENAME ---

        // 2. Get the file extension from the original filename (e.g., ".png", ".jpg")
        const extension = path.extname(originalFilename);

        // 3. Count how many images already exist in the database for this specific category
        const count = await prisma.image.count({
            where: {
                category: category,
            },
        });

        // 4. Construct the new, unique filename
        // e.g., "logo-design-1.png", "logo-design-2.png", etc.
        const newFilename = `${category}-${count + 1}${extension}`;

        // --- End of new logic ---


        // 5. Upload the file to Vercel Blob using the NEW unique filename
        const blob = await put(newFilename, request.body, {
            access: 'public',
        });

        // Save the metadata to our Postgres database
        const newImage = await prisma.image.create({
            data: {
                url: blob.url,
                pathname: blob.pathname, // This will be the new unique name, e.g., "logo-design-1.png"
                category: category,
            },
        });

        // Invalidate the cache for the public gallery API path
        revalidatePath(`/api/gallery/${category}`);
        revalidatePath('/admin/manage');
        revalidatePath('/');
        // Return the successful response
        return NextResponse.json(newImage);

    } catch (error) {
        console.error("Error during upload and DB save:", error);
        return NextResponse.json({ message: 'An error occurred.', error: error.message }, { status: 500 });
    }
}