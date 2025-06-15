"use client"

import React, { useState, useEffect, useRef } from "react";
import "./ProjectGallery.css"; // Ensure CSS is linked

function GalleryBox({ image }) {
    // State to hold the current active image (the one fading in)
    const [activeImage, setActiveImage] = useState(image);
    // State to hold the previous image (the one fading out)
    const [previousImage, setPreviousImage] = useState(null);
    // State to control the 'active' class on the previous image, ensuring it fades out
    const [previousActive, setPreviousActive] = useState(false);

    // Ref to track if it's the very first render to avoid transition on initial load
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            // On initial mount, just set the active image if available, no transition needed
            if (image) {
                setActiveImage(image);
            }
            return;
        }

        // Only trigger transition if the new image is different from the currently active one
        if (image && image.id !== activeImage?.id) {
            setPreviousImage(activeImage); // Store the current active image as previous
            setPreviousActive(true);       // Mark previous image as "active" briefly for fade-out start
            setActiveImage(image);         // Set the new image as active (will fade in)

            // After a short delay (matching transition duration), clear the previous image
            // This ensures the old image is removed from the DOM AFTER it has fully faded out.
            const timer = setTimeout(() => {
                setPreviousImage(null);
                setPreviousActive(false); // Reset this state
            }, 500); // Matches the 0.5s transition duration in CSS

            return () => clearTimeout(timer); // Cleanup timeout
        } else if (!image && activeImage) {
            // If the image prop becomes null (e.g., slot becomes empty), clear active image
            setPreviousImage(activeImage);
            setPreviousActive(true);
            setActiveImage(null);
            const timer = setTimeout(() => {
                setPreviousImage(null);
                setPreviousActive(false);
            }, 500);
            return () => clearTimeout(timer);
        }
        // If image is the same or both are null, do nothing
    }, [image, activeImage]); // Dependency array: re-run when 'image' prop or 'activeImage' state changes

    // Determine if we should show the skeleton or not
    const showSkeleton = !activeImage && !previousImage;

    return (
        <div className="gallery-box">
            {showSkeleton ? (
                <div className="skeleton-box-inner"></div> // Render skeleton if no images
            ) : (
                <>
                    {/* Render previous image for fade-out, if it exists and is not null */}
                    {previousImage && (
                        <img
                            key={previousImage.id + '_prev'} // Unique key for previous image instance
                            src={previousImage.src}
                            alt={previousImage.alt}
                            // 'previous' class for fade-out, 'active' if it's still in the process of being 'current'
                            className={`gallery-box-image previous ${previousActive ? 'active' : ''}`}
                        />
                    )}
                    {/* Render active image for fade-in */}
                    {activeImage && (
                        <img
                            key={activeImage.id + '_active'} // Unique key for active image instance
                            src={activeImage.src}
                            alt={activeImage.alt}
                            className="gallery-box-image active" // Always 'active' for the incoming image
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default GalleryBox;