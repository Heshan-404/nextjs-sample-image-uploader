import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const data = await req.formData();
  const file = data.get('image');

  if (!file) {
    return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = file.name.replaceAll(' ', '_');
  const filepath = path.join(process.cwd(), 'public/portfolio-images', filename);
  await writeFile(filepath, buffer);

  return new Response(JSON.stringify({ message: 'Image uploaded successfully' }), { status: 200 });
}
