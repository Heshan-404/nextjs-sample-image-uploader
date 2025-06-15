// src/data/galleryData.js

// Import all your images
import illustratorImg from '../../public/assets/illustrator.png';
import photoshopImg from '../../public/assets/photoShop.png';
import passionImg from '../../public/assets/passionImg.png';
import tshirtImg1 from '../../public/assets/imgOne.jpg';
import reactLogoImg from '../../public/assets/react.svg';
import socialPost1 from '../../public/assets/img.png';
import aboutImg from '../../public/assets/aboutImg.png';

// Organize the images into categories
export const galleryData = {
    "logo-design": [
        { id: "logo1", src: illustratorImg, alt: "Illustrator Logo Design" },
        { id: "logo2", src: photoshopImg, alt: "Photoshop Logo Concept" },
        { id: "logo3", src: passionImg, alt: "Passion Project Logo" },
    ],
    "t-shirt-design": [
        // This category only has 2 images, it will be split into two boxes of 1 image each.
        { id: "shirt1", src: tshirtImg1, alt: "Graphic T-shirt Mockup" },
        { id: "shirt2", src: reactLogoImg, alt: "React Logo T-shirt" },
    ],
    "social-media": [
        { id: "social1", src: socialPost1, alt: "Abstract Social Media Post" },
    ], // This will result in one box with one image, and three empty boxes.
    "poster-design": [],
    // ... other categories
};