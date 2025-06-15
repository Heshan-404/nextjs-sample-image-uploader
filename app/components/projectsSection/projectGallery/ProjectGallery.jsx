'use client';

import React, { useState, useEffect, useRef } from "react";
import "./ProjectGallery.css";
import GalleryBox from "./GalleryBox";
// import { galleryData } from "../../../data/galleryData"; // No longer needed! We fetch from the API.

// --- Helper function to shuffle an array (Fisher-Yates shuffle) ---
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- Helper function to get image dimensions for masonry layout ---
const getImageDimensions = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = reject;
        img.src = src;
    });
};

// --- Skeleton Component for loading state ---
function GallerySkeletonBox({ style }) {
    return <div className="skeleton-box" style={style}></div>;
}

// --- The Main Gallery Component ---
function ProjectGallery({ category }) {
    const [allCategoryImages, setAllCategoryImages] = useState([]); // Pool of images for the current category
    const [displayedImageIds, setDisplayedImageIds] = useState(Array(4).fill(null)); // IDs in the 4 display slots
    const [isLoading, setIsLoading] = useState(true);
    const flexGrowRefs = useRef(Array(4).fill(1)); // Stores flex-grow values to prevent re-renders

    // --- EFFECT 1: Fetch data and set up the initial gallery view ---
    useEffect(() => {
        const prepareImages = async () => {
            setIsLoading(true);
            try {
                // FETCH from our new API endpoint instead of using static data
                const response = await fetch(`/api/gallery/${category}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch gallery data from API.');
                }
                const baseImages = await response.json(); // e.g., [{ id, src, alt }, ...]

                // The rest of the logic remains the same, operating on fetched data.
                // Filter for unique images by source URL
                const uniqueImages = [];
                const seenSrcs = new Set();
                baseImages.forEach(image => {
                    if (!seenSrcs.has(image.src)) {
                        uniqueImages.push(image);
                        seenSrcs.add(image.src);
                    }
                });
                setAllCategoryImages(uniqueImages);

                // --- Logic to pick 4 initial images without repetition ---
                const initialDisplayedIds = Array(4).fill(null);
                const chosenImageIdsForInitialDisplay = new Set();
                const dimensionPromises = [];

                for (let i = 0; i < 4; i++) {
                    const availableImages = uniqueImages.filter(img => !chosenImageIdsForInitialDisplay.has(img.id));
                    if (availableImages.length > 0) {
                        const chosenImage = shuffleArray(availableImages)[0];
                        initialDisplayedIds[i] = chosenImage.id;
                        chosenImageIdsForInitialDisplay.add(chosenImage.id);

                        // Calculate initial flex-grow values
                        dimensionPromises.push(
                            getImageDimensions(chosenImage.src)
                                .then(dims => { flexGrowRefs.current[i] = dims.height / dims.width || 1; })
                                .catch(() => { flexGrowRefs.current[i] = 1; })
                        );
                    }
                }

                await Promise.all(dimensionPromises); // Wait for all calculations
                setDisplayedImageIds(initialDisplayedIds);

            } catch (error) {
                console.error("Error fetching or preparing images:", error);
                setAllCategoryImages([]); // Clear images on error
            } finally {
                setIsLoading(false);
            }
        };

        if (category) {
            prepareImages();
        }
    }, [category]); // Re-run whenever the category prop changes

    // --- EFFECT 2: The global shuffle timer ---
    // This logic does not need to change, as it works with the `allCategoryImages` state.
    useEffect(() => {
        if (isLoading || allCategoryImages.length < 2) return; // Don't shuffle if loading or not enough images

        const timer = setInterval(() => {
            setDisplayedImageIds(prevDisplayedIds => {
                const newDisplayedIds = [...prevDisplayedIds];
                const sourcesBeforeShuffle = new Set(prevDisplayedIds.map(id => id ? allCategoryImages.find(img => img.id === id)?.src : null).filter(Boolean));
                const sourcesChosenInThisCycle = new Set();
                const eligibleSlotsToShuffle = newDisplayedIds.map((id, index) => id !== null ? index : -1).filter(index => index !== -1);

                if (eligibleSlotsToShuffle.length === 0) return prevDisplayedIds;

                const nextChoices = {};
                const shuffledSlots = shuffleArray(eligibleSlotsToShuffle);

                for (const slotIndex of shuffledSlots) {
                    const currentImageId = newDisplayedIds[slotIndex];
                    const currentImageSrc = allCategoryImages.find(img => img.id === currentImageId)?.src;
                    const candidates = allCategoryImages.filter(img => !sourcesBeforeShuffle.has(img.src) && !sourcesChosenInThisCycle.has(img.src));
                    let chosenImage = null;

                    if (candidates.length > 0) {
                        chosenImage = shuffleArray(candidates)[0];
                    } else {
                        const fallbackCandidates = allCategoryImages.filter(img => img.src !== currentImageSrc && !sourcesChosenInThisCycle.has(img.src));
                        chosenImage = fallbackCandidates.length > 0 ? shuffleArray(fallbackCandidates)[0] : allCategoryImages.find(img => img.id !== currentImageId) || allCategoryImages[0];
                    }

                    if (chosenImage) {
                        nextChoices[slotIndex] = chosenImage;
                        sourcesChosenInThisCycle.add(chosenImage.src);
                    }
                }

                Object.keys(nextChoices).forEach(slotIndex => {
                    const chosenImage = nextChoices[slotIndex];
                    newDisplayedIds[slotIndex] = chosenImage.id;
                    getImageDimensions(chosenImage.src).then(dims => { flexGrowRefs.current[slotIndex] = dims.height / dims.width || 1; });
                });

                return newDisplayedIds;
            });
        }, 5500); // Shuffle interval

        return () => clearInterval(timer);
    }, [isLoading, allCategoryImages]);


    // --- Render Logic ---
    return (
        <div className="project-gallery-container">
            {isLoading ? (
                <div className="gallery-flex-view">
                    <div className="gallery-column">
                        <GallerySkeletonBox style={{ height: '50%' }} />
                        <GallerySkeletonBox style={{ height: '50%' }} />
                    </div>
                    <div className="gallery-column">
                        <GallerySkeletonBox style={{ height: '50%' }} />
                        <GallerySkeletonBox style={{ height: '50%' }} />
                    </div>
                </div>
            ) : (
                <div className="gallery-flex-view">
                    <div className="gallery-column">
                        {displayedImageIds.slice(0, 2).map((imageId, index) => {
                            const image = imageId ? allCategoryImages.find(img => img.id === imageId) : null;
                            return (
                                <div key={`left-slot-${index}`} className="gallery-item-wrapper" style={{ flexGrow: flexGrowRefs.current?.[index] || 1 }}>
                                    {image ? <GalleryBox image={image} /> : <GallerySkeletonBox style={{ height: '100%' }} />}
                                </div>
                            );
                        })}
                    </div>
                    <div className="gallery-column">
                        {displayedImageIds.slice(2, 4).map((imageId, index) => {
                            const actualIndex = index + 2;
                            const image = imageId ? allCategoryImages.find(img => img.id === imageId) : null;
                            return (
                                <div key={`right-slot-${actualIndex}`} className="gallery-item-wrapper" style={{ flexGrow: flexGrowRefs.current?.[actualIndex] || 1 }}>
                                    {image ? <GalleryBox image={image} /> : <GallerySkeletonBox style={{ height: '100%' }} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectGallery;