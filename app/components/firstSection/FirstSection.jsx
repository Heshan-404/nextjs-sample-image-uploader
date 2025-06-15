// REMOVE "use client". This component is purely presentational.
import React from "react";
import Image from "next/image"; // 1. IMPORT the Image component
import "./FirstSection.css";

// 2. REMOVE the old, incorrect import of the image.
// import imgOne from "../../../public/assets/imgOne.jpg";

function FirstSection() {
    return (
        <div className="pt-5 container-first">
            {/* This div will now act as a container for the image */}
            <div id="imgOne">
                {/* 3. ADD THE NEXT.JS IMAGE COMPONENT */}
                <Image
                    src="/assets/imgOne.jpg" // Path from the /public folder
                    alt="Background image of my portfolio"
                    fill // Makes the image fill its parent container (#imgOne)
                    sizes="100vw" // Informs Next.js the image can be up to 100% of the viewport width
                    priority // Tells Next.js to load this image first (important for hero images)
                    quality={75} // You can adjust the quality (default is 75)
                    style={{
                        objectFit: 'cover', // Behaves like "background-size: cover"
                        zIndex: -1,         // Puts the image behind other content in this div
                    }}
                />

                <div className="first-section-container d-flex justify-content-center align-items-center">
                    <div className="text">
                        <div className="iam-text">I am,</div>
                        <div className="ravindu-text">RAVINDU</div>
                        <div className="wickramasinghe-text">WICKRAMASINGHE</div>
                        <div className="graphic-designer-text">GRAPHIC DESIGNER</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FirstSection;