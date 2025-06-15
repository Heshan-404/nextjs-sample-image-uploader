"use client"

import React, {useState, useEffect, useRef} from "react";
import "./ProjectGallery.css";
import GalleryBox from "./GalleryBox";
import {galleryData} from "../../../data/galleryData"; // Your unchanged galleryData.js

// --- Helper function to shuffle an array (Fisher-Yates shuffle) ---
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Skeleton Component for individual empty slots
function GallerySkeletonBox({style}) {
    return <div className="skeleton-box" style={style}></div>;
}

// getImageDimensions Helper
const getImageDimensions = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({width: img.naturalWidth, height: img.naturalHeight});
        img.onerror = reject;
        img.src = src;
    });
};

function ProjectGallery({category}) {
    const [allCategoryImages, setAllCategoryImages] = useState([]); // Global pool of images for the category
    const [displayedImageIds, setDisplayedImageIds] = useState(Array(4).fill(null)); // IDs of images currently in each of the 4 slots
    const [isLoading, setIsLoading] = useState(true);

    // Ref to store computed flexGrow values for each of the 4 display slots
    const flexGrowRefs = useRef(Array(4).fill(1));

    useEffect(() => {
        const prepareImages = async () => {
            setIsLoading(true);
            const baseImages = galleryData[category] || [];

            // Filter out duplicate images by src from the entire category pool
            const uniqueImages = [];
            const seenSrcs = new Set();
            baseImages.forEach(image => {
                if (!seenSrcs.has(image.src)) {
                    uniqueImages.push(image);
                    seenSrcs.add(image.src);
                }
            });
            setAllCategoryImages(uniqueImages);

            const initialDisplayedIds = Array(4).fill(null);
            const chosenImageIdsForInitialDisplay = new Set(); // Track IDs chosen for initial display to prevent duplicates
            const dimensionPromises = []; // Collect promises for initial flexGrow calculations

            for (let i = 0; i < 4; i++) {
                if (uniqueImages.length > 0) {
                    // Filter available images to only those NOT already chosen for initial display
                    const availableImages = uniqueImages.filter(img => !chosenImageIdsForInitialDisplay.has(img.id));

                    if (availableImages.length > 0) {
                        const randomIndex = Math.floor(Math.random() * availableImages.length);
                        const chosenImage = availableImages[randomIndex];
                        initialDisplayedIds[i] = chosenImage.id;
                        chosenImageIdsForInitialDisplay.add(chosenImage.id); // Add to the set of chosen IDs

                        // Collect promise for flexGrow calculation
                        dimensionPromises.push(
                            getImageDimensions(chosenImage.src)
                                .then(dims => {
                                    flexGrowRefs.current[i] = dims.height / dims.width || 1;
                                })
                                .catch(error => {
                                    console.error("Error getting initial image dimensions:", error);
                                    flexGrowRefs.current[i] = 1; // Fallback
                                })
                        );
                    } else {
                        // No more unique images left to fill initial slots without repetition
                        break;
                    }
                }
            }

            await Promise.all(dimensionPromises); // Wait for all initial flexGrow calculations

            setDisplayedImageIds(initialDisplayedIds);
            setIsLoading(false);
        };
        prepareImages();
    }, [category]); // Re-run when category changes

    // --- Global Shuffle Controller ---
    useEffect(() => {
        if (isLoading || allCategoryImages.length === 0) return; // Don't shuffle if no images in category

        const timer = setInterval(() => {
            setDisplayedImageIds(prevDisplayedIds => {
                const newDisplayedIds = [...prevDisplayedIds];
                // Set of sources currently displayed BEFORE THIS SHUFFLE CYCLE starts
                const sourcesBeforeShuffle = new Set(prevDisplayedIds.map(id =>
                    id ? allCategoryImages.find(img => img.id === id)?.src : null
                ).filter(Boolean)); // Filter out nulls/undefineds

                // This set tracks sources chosen *within this current shuffle cycle*
                const sourcesChosenInThisCycle = new Set();

                const eligibleSlotsToShuffle = newDisplayedIds
                    .map((id, index) => id !== null ? index : -1) // Only filled slots are eligible
                    .filter(index => index !== -1);

                if (eligibleSlotsToShuffle.length === 0) {
                    return prevDisplayedIds; // No filled slots to shuffle
                }

                const nextChoices = {};
                const shuffledSlots = shuffleArray(eligibleSlotsToShuffle);

                for (const slotIndex of shuffledSlots) {
                    const currentImageId = newDisplayedIds[slotIndex]; // Current image ID in this slot
                    const currentImageSrc = allCategoryImages.find(img => img.id === currentImageId)?.src;

                    // Candidates are images from the full pool that are NOT:
                    // 1. Currently displayed anywhere (from previous state)
                    // 2. Already chosen for another slot in this *current* shuffle cycle
                    const candidates = allCategoryImages.filter(img =>
                        !sourcesBeforeShuffle.has(img.src) &&
                        !sourcesChosenInThisCycle.has(img.src)
                    );

                    let chosenImage = null;

                    if (candidates.length > 0) {
                        // Priority 1: Pick a completely fresh image
                        chosenImage = shuffleArray(candidates)[0];
                    } else {
                        // Fallback 1: All fresh images are taken. Try to find an image that IS displayed
                        // but not currently in this specific slot, and not chosen by another slot THIS cycle.
                        const fallbackCandidates = allCategoryImages.filter(img =>
                            img.src !== currentImageSrc && // Not the current image in THIS slot
                            !sourcesChosenInThisCycle.has(img.src) // Not chosen by another slot THIS cycle
                        );
                        if (fallbackCandidates.length > 0) {
                            chosenImage = shuffleArray(fallbackCandidates)[0];
                        } else {
                            // Fallback 2: If we reach here, it means all unique images are either the current one in this slot,
                            // or already chosen by another slot in this cycle. This typically means
                            // there are very few unique images overall (e.g., only 1-4 images for 4 slots).
                            // In this extreme case, we might have to reuse an image from a different slot,
                            // but we still try not to reuse the *current* image in this slot.
                            const lastResortCandidates = allCategoryImages.filter(img => img.src !== currentImageSrc);
                            if (lastResortCandidates.length > 0) {
                                chosenImage = shuffleArray(lastResortCandidates)[0];
                            } else {
                                // If only one unique image exists in the entire category, this is it.
                                chosenImage = allCategoryImages.find(img => img.id === currentImageId);
                            }
                        }
                    }

                    if (chosenImage) {
                        nextChoices[slotIndex] = chosenImage;
                        // Add the chosen image's source to the set for this cycle to prevent other slots from picking it
                        sourcesChosenInThisCycle.add(chosenImage.src);
                    }
                }

                // Apply changes to newDisplayedIds and queue flexGrow updates
                const dimensionPromises = [];

                for (const slotIndex in nextChoices) {
                    const chosenImage = nextChoices[slotIndex];
                    newDisplayedIds[slotIndex] = chosenImage.id;

                    // Update flexGrow for the slot (async, won't block state update)
                    dimensionPromises.push(
                        getImageDimensions(chosenImage.src)
                            .then(dims => {
                                flexGrowRefs.current[slotIndex] = dims.height / dims.width || 1;
                            })
                            .catch(error => {
                                console.error("Error getting image dimensions for shuffle:", error);
                                flexGrowRefs.current[slotIndex] = 1;
                            })
                    );
                }

                // Fire off the flexGrow updates. They'll complete asynchronously.
                Promise.all(dimensionPromises);

                return newDisplayedIds; // Synchronous return of the new state
            });
        }, 5500); // Shuffles every 2.5 seconds

        return () => clearInterval(timer);
    }, [isLoading, allCategoryImages]); // Rerun if loading state or category images change

    // --- Render Logic ---
    return (
        <div className="project-gallery-container">
            {isLoading ? (
                <div className="gallery-flex-view">
                    <div className="gallery-column">
                        <GallerySkeletonBox style={{height: '50%'}}/>
                        <GallerySkeletonBox style={{height: '50%'}}/>
                    </div>
                    <div className="gallery-column">
                        <GallerySkeletonBox style={{height: '50%'}}/>
                        <GallerySkeletonBox style={{height: '50%'}}/>
                    </div>
                </div>
            ) : (
                <div className="gallery-flex-view">
                    <div className="gallery-column">
                        {displayedImageIds.slice(0, 2).map((imageId, index) => {
                            const image = imageId ? allCategoryImages.find(img => img.id === imageId) : null;
                            return (
                                <div key={`left-slot-${index}`} className="gallery-item-wrapper"
                                     style={{flexGrow: flexGrowRefs.current?.[index] || 1}}>
                                    {image ? <GalleryBox image={image}/> :
                                        <GallerySkeletonBox style={{height: '100%'}}/>}
                                </div>
                            );
                        })}
                    </div>
                    <div className="gallery-column">
                        {displayedImageIds.slice(2, 4).map((imageId, index) => {
                            const actualIndex = index + 2;
                            const image = imageId ? allCategoryImages.find(img => img.id === imageId) : null;
                            return (
                                <div key={`right-slot-${actualIndex}`} className="gallery-item-wrapper"
                                     style={{flexGrow: flexGrowRefs.current?.[actualIndex] || 1}}>
                                    {image ? <GalleryBox image={image}/> :
                                        <GallerySkeletonBox style={{height: '100%'}}/>}
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