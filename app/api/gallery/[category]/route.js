import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// NOTE: We have REMOVED 'export const dynamic = "force-dynamic";'
// This allows Next.js to cache the responses of this route by default for high performance.
// The cache will be invalidated on-demand by our other routes.

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { category } = params;

    if (!category) {
        return NextResponse.json({ message: 'Category is required.' }, { status: 400 });
    }

    try {
        const images = await prisma.image.findMany({
            where: {
                category: category,
            },
            select: {
                id: true,
                url: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        // Map the database data to the format your frontend component expects
        const formattedImages = images.map(img => ({
            id: img.id,
            src: img.url,
            alt: `Gallery image in category ${category}`
        }));

        return NextResponse.json(formattedImages);

    } catch (error) {
        console.error(`Error fetching images for category ${category}:`, error);
        return NextResponse.json({ message: 'Failed to fetch images.' }, { status: 500 });
    }
}