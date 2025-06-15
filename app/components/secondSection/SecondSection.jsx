// File: app/components/SecondSection/SecondSection.jsx

// 1. REMOVE "use client". This component is just displaying content. It can be a fast Server Component.
import React from "react";
import Image from "next/image"; // 2. IMPORT the Image component
import "./SecondSection.css";

function SecondSection() {
    return (
        <div>
            <div className="row p-0 m-0 pt-5">
                {/* This div will be the container for our background image */}
                <div
                    className="col-sm-12 col-md-6 position-relative z-1"
                    id="passion-img"
                >
                    {/* 3. ADD the optimized Next.js Image component */}
                    <Image
                        src="/assets/passionImg.png" // Correct path from /public folder
                        alt="An abstract image representing passion and design"
                        fill // Makes the image fill its parent container
                        sizes="(max-width: 768px) 100vw, 50vw" // Helps Next.js create optimal image sizes
                        style={{
                            objectFit: 'cover', // This is equivalent to "background-size: cover"
                        }}
                    />
                </div>
                <div className="col-sm-12 col-md-6 passion-details">
                    <div className="passion-text dorsa-regular z-3 position-relative">
                        PASSION
                    </div>
                    <div className="passion-text dorsa-regular z-3 position-relative">
                        AND PRECISION
                    </div>
                    <div className="passion-desc position-relative z-3">
                        Hey, I'm Ravindu. Since I started my design journey, I've been
                        dedicated to creating innovative and high-quality graphic designs.
                        My expertise in branding, digital illustrations, and print media
                        allows me to deliver impactful solutions. Let's work together to
                        bring your vision to life.
                    </div>
                    <div className="cliped-text dorsa-regular">PASSION</div>
                    <div className="cliped-text dorsa-regular">PRECISION</div>
                </div>
            </div>
        </div>
    );
}

export default SecondSection;