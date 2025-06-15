import {PrismaClient} from '@prisma/client';
import Image from 'next/image';
import {del} from '@vercel/blob';
import {revalidatePath} from 'next/cache';
import LogoutButton from "../LogoutButton";
import UploadButton from "../UploadButton";

const prisma = new PrismaClient();

// The Server Action that handles image deletion.
async function deleteImage(formData) {
    'use server';
    const id = formData.get('id');
    const pathname = formData.get('pathname');
    const category = formData.get('category'); // 1. Get the category from the form data

    if (!id || !pathname || !category) {
        console.error("Missing data for deletion.");
        return;
    }

    try {
        await del(pathname); // Delete from Vercel Blob
        await prisma.image.delete({where: {id: id}}); // Delete from Database

        // 2. Invalidate BOTH the admin page (to refresh the CMS view) AND the public API route.
        revalidatePath('/admin/manage');
        revalidatePath('/');
        revalidatePath(`/api/gallery/${category}`);

    } catch (error) {
        console.error("Error deleting image:", error);
    }
}

// The Server Component that displays the CMS dashboard.
export default async function ManageGalleryPage() {
    const images = await prisma.image.findMany({
        orderBy: [{category: 'asc'}, {createdAt: 'desc'}],
    });

    const groupedImages = images.reduce((acc, image) => {
        const category = image.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(image);
        return acc;
    }, {});

    return (
        <main style={{padding: 20, color: 'white'}} className={"h-100 bg-black"}>
            <LogoutButton/>
            <h1>Manage Gallery</h1>
            <UploadButton/>

            {images.length === 0 && (
                <p>No images found. Go to the <a href="/admin" style={{color: '#00d8ff'}}>Admin Upload</a> page to add
                    some.</p>
            )}

            {Object.keys(groupedImages).map((category) => (
                <section key={category} style={{marginBottom: '40px'}}>
                    <h2 style={{
                        textTransform: 'capitalize',
                        borderBottom: '2px solid #555',
                        paddingBottom: '10px',
                        marginBottom: '20px'
                    }}>
                        {category.replace('-', ' ')}
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}>
                        {groupedImages[category].map((image) => (
                            <div key={image.id} style={{
                                border: '1px solid #444',
                                padding: '10px',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Image
                                    src={image.url}
                                    alt={`Image for category ${image.category}`}
                                    width={250}
                                    height={250}
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '4px',
                                        marginBottom: '10px'
                                    }}
                                />
                                <form action={deleteImage} style={{marginTop: 'auto'}}>
                                    <input type="hidden" name="id" value={image.id}/>
                                    <input type="hidden" name="pathname" value={image.pathname}/>
                                    {/* 3. Pass the category to the Server Action via a hidden input */}
                                    <input type="hidden" name="category" value={image.category}/>
                                    <button type="submit" style={{
                                        width: '100%',
                                        cursor: 'pointer',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '4px'
                                    }}>
                                        Delete
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}