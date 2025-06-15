import fs from 'fs';
import path from 'path';

export default function Home() {
  const imagesDir = path.join(process.cwd(), 'public/portfolio-images');
  const imageFiles = fs.readdirSync(imagesDir);

  return (
    <main style={{ padding: 20 }}>
      <h1>My Portfolio Gallery</h1>
      <div className="grid">
        {imageFiles.map((file, index) => (
          <img key={index} src={`/portfolio-images/${file}`} alt={`Project ${index}`} />
        ))}
      </div>
    </main>
  );
}
