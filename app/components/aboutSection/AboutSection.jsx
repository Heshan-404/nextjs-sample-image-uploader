// File: app/components/AboutSection/AboutSection.jsx

// 1. IMPORT the Next.js Image component
import Image from "next/image";
import React from "react";
import "./AboutSection.css";

// 2. NO MORE image imports from `assets`. They are now referenced directly.
// import photoShopImg from "../../assets/photoShop.png";  <-- DELETE THIS
// import illustrator from "../../assets/illustrator.png";  <-- DELETE THIS
// ...and so on for all images.

// This component is a Server Component. No "use client" is needed.
function AboutSection() {
    return (
        <div className="row about-container">
            <div className="col-sm-12 col-md-6">
                <div>
                    <div className="about-text dorsa-regular position-relative z-1">
                        ABOUT
                    </div>
                    <div className="about-desc position-relative z-1">
                        Hey, I'm Ravindu. Since I started my design journey, I've been
                        dedicated to creating innovative and high-quality graphic designs.
                        My expertise in branding, digital illustrations, and print media
                        allows me to deliver impactful solutions. Let's work together to
                        bring your vision to life.
                    </div>
                    <div className="skill-section">
                        <div className="skills-text position-relative z-1">SKILLS</div>
                        <div className="skills-list gap-4 d-flex position-relative z-1">
                            {/* 3. USE the <Image> component with correct string paths */}
                            <Image src="/assets/photoShop.png" alt="Photoshop icon" width={50} height={50}
                                   className="skill-img"/>
                            <Image src="/assets/illustrator.png" alt="Illustrator icon" width={50} height={50}
                                   className="skill-img"/>
                            <Image src="/assets/premierPro.png" alt="Premiere Pro icon" width={50} height={50}
                                   className="skill-img"/>
                            <Image src="/assets/maya.png" alt="Autodesk Maya icon" width={50} height={50}
                                   className="skill-img"/>

                            {/* 4. Make the CV section a clickable download link */}
                            <a href="/assets/your-cv-file.pdf" download className="ms-5 cv-download ">
                                <Image src="/assets/pdfIcon.png" alt="Download CV icon" width={50} height={50}
                                       className={"align-self-center"}/>
                                <div className="cv-text">DOWNLOAD CV HERE</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="cliped-about-text dorsa-regular">ABOUT</div>
            </div>
            {/* This div will now have the background image from the CSS */}
            <div
                className="col-sm-12 col-md-6 position-relative"
                id="about-img"
            ><Image
                src="/assets/aboutImg.png"
                alt="A stylized image of the portfolio owner"
                fill
                // This is more optimal than "100vw" because the image is in a column
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                style={{
                    objectFit: 'cover', // Behaves like "background-size: cover"
                }}
            /></div>
        </div>
    );
}

export default AboutSection;