'use client';

import React, {useRef, useEffect, useState, useCallback} from "react";

// Import all the page components
import Header from "./components/header/Header";
import FirstSection from "./components/firstSection/FirstSection";
import SecondSection from "./components/secondSection/SecondSection";
import AboutSection from "./components/aboutSection/AboutSection";
import ProjectLanding from "./components/projectsSection/projectLanding/ProjectLanding";
import ProjectsMenu from "./components/projectsSection/projectsMenu/ProjectsMenu";
import ProjectGallery from "./components/projectsSection/projectGallery/ProjectGallery";

// Define the list of categories to be displayed on the main page.
const GALLERY_CATEGORIES = [
    "logo-design",
    "t-shirt-design",
    "social-media",
    "poster-design",
    "cover-page",
    "brand-identity",
    "3d-design",
    "other-design"
];

export default function PortfolioPageClient() {
    // --- Scroll-Jacking Logic (no changes needed) ---
    const headerRef = useRef(null);
    const firstSectionRef = useRef(null);
    const secondSectionRef = useRef(null);
    const aboutSectionRef = useRef(null);
    const projectLandingRef = useRef(null);
    const projectsMenuRef = useRef(null);

    const sections = [
        headerRef, firstSectionRef, secondSectionRef, aboutSectionRef, projectLandingRef, projectsMenuRef
    ];
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const touchStart = useRef(0);
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };
    const scrollToSection = useCallback((index) => {
        if (index >= 0 && index < sections.length && sections[index].current) {
            setIsScrolling(true);
            window.scrollTo({top: sections[index].current.offsetTop, behavior: "smooth"});
            setCurrentSectionIndex(index);
            setTimeout(() => setIsScrolling(false), 700);
        }
    }, [sections]);
    const handleWheel = useCallback(debounce((event) => {
        if (isScrolling) return;
        const scrollDown = event.deltaY > 0;
        const nextSectionIndex = scrollDown ? Math.min(currentSectionIndex + 1, sections.length - 1) : Math.max(currentSectionIndex - 1, 0);
        if (nextSectionIndex !== currentSectionIndex) {
            scrollToSection(nextSectionIndex);
        }
    }, 200), [isScrolling, currentSectionIndex, scrollToSection, sections.length]);
    const handleTouchStart = useCallback((event) => {
        touchStart.current = event.touches[0].clientY;
    }, []);
    const handleTouchEnd = useCallback(debounce((event) => {
        if (isScrolling) return;
        const touchEnd = event.changedTouches[0].clientY;
        const deltaY = touchStart.current - touchEnd;
        const scrollThreshold = 50;
        if (Math.abs(deltaY) > scrollThreshold) {
            const scrollUp = deltaY > 0;
            const nextSectionIndex = scrollUp ? Math.min(currentSectionIndex + 1, sections.length - 1) : Math.max(currentSectionIndex - 1, 0);
            if (nextSectionIndex !== currentSectionIndex) {
                scrollToSection(nextSectionIndex);
            }
        }
    }, 200), [isScrolling, currentSectionIndex, scrollToSection, sections.length]);
    useEffect(() => {
        window.addEventListener("wheel", handleWheel, {passive: false});
        window.addEventListener("touchstart", handleTouchStart, {passive: true});
        window.addEventListener("touchend", handleTouchEnd, {passive: false});
        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleWheel, handleTouchStart, handleTouchEnd]);
    // --- End of Scroll-Jacking Logic ---

    return (
        <div id="body">
            <Header/>
            <FirstSection/>
            <SecondSection/>
            <ProjectsMenu/>

            {GALLERY_CATEGORIES.map((category) => (
                <React.Fragment key={category}>
                    <ProjectLanding
                        name={category.replace('-', ' ').toUpperCase()}
                        ismain={false}
                    />
                    <ProjectGallery
                        category={category}
                    />
                </React.Fragment>
            ))}
        </div>
    );
};