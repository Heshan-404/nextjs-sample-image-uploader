'use client';

import React, {useRef, useEffect, useState, useCallback} from "react";

// Import all the components that make up your page
import Header from "./components/header/Header";
import FirstSection from "./components/firstSection/FirstSection";
import SecondSection from "./components/secondSection/SecondSection";
import AboutSection from "./components/aboutSection/AboutSection";
import ProjectLanding from "./components/projectsSection/projectLanding/ProjectLanding";
import ProjectsMenu from "./components/projectsSection/projectsMenu/ProjectsMenu";
// import ProjectGallery from "./components/projectsSection/projectGallery/ProjectGallery";

export default function PortfolioPageClient() {
    // A ref is created for each section that is part of the scroll effect
    const headerRef = useRef(null);
    const firstSectionRef = useRef(null);
    const secondSectionRef = useRef(null);
    const aboutSectionRef = useRef(null);
    const projectLandingRef = useRef(null);
    const projectsMenuRef = useRef(null);
    // When you're ready to add the gallery to the scroll effect, uncomment its ref
    // const projectGalleryRef = useRef(null);

    // This array defines the exact order and list of scrollable sections.
    // It MUST match the order of the sections rendered with refs in the JSX below.
    const sections = [
        headerRef,
        firstSectionRef,
        secondSectionRef,
        aboutSectionRef,
        projectLandingRef,
        projectsMenuRef,
        // projectGalleryRef, // Add this back when you render its section
    ];

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const touchStart = useRef(0);

    // Debounce helper to prevent scroll events from firing too rapidly
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    // The core function to scroll to a specific section index
    const scrollToSection = useCallback(
        (index) => {
            if (index >= 0 && index < sections.length && sections[index].current) {
                setIsScrolling(true);
                window.scrollTo({
                    top: sections[index].current.offsetTop,
                    behavior: "smooth",
                });
                setCurrentSectionIndex(index);
                // The timeout duration should be slightly longer than the smooth scroll animation
                setTimeout(() => setIsScrolling(false), 700);
            }
        },
        [sections] // Dependency array
    );

    // Handles mouse wheel events
    const handleWheel = useCallback(
        debounce((event) => {
            if (isScrolling) return;

            const scrollDown = event.deltaY > 0;
            const nextSectionIndex = scrollDown
                ? Math.min(currentSectionIndex + 1, sections.length - 1)
                : Math.max(currentSectionIndex - 1, 0);

            if (nextSectionIndex !== currentSectionIndex) {
                scrollToSection(nextSectionIndex);
            }
        }, 200),
        [isScrolling, currentSectionIndex, scrollToSection, sections.length]
    );

    // Handles touch start events for mobile
    const handleTouchStart = useCallback((event) => {
        touchStart.current = event.touches[0].clientY;
    }, []);

    // Handles touch end events for mobile
    const handleTouchEnd = useCallback(
        debounce((event) => {
            if (isScrolling) return;

            const touchEnd = event.changedTouches[0].clientY;
            const deltaY = touchStart.current - touchEnd;
            const scrollThreshold = 50; // Minimum swipe distance to trigger a scroll

            if (Math.abs(deltaY) > scrollThreshold) {
                const scrollUp = deltaY > 0;
                const nextSectionIndex = scrollUp
                    ? Math.min(currentSectionIndex + 1, sections.length - 1)
                    : Math.max(currentSectionIndex - 1, 0);

                if (nextSectionIndex !== currentSectionIndex) {
                    scrollToSection(nextSectionIndex);
                }
            }
        }, 200),
        [isScrolling, currentSectionIndex, scrollToSection, sections.length]
    );

    // Effect to add and remove event listeners safely
    useEffect(() => {
        window.addEventListener("wheel", handleWheel, {passive: false});
        window.addEventListener("touchstart", handleTouchStart, {passive: true});
        window.addEventListener("touchend", handleTouchEnd, {passive: false});

        // Cleanup function to remove listeners when the component unmounts
        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleWheel, handleTouchStart, handleTouchEnd]);

    return (
        <div id="body">
            {/* Each scrollable section is wrapped in a div with its corresponding ref */}
            <div ref={headerRef}>
                <Header/>
            </div>
            <div ref={firstSectionRef}>
                <FirstSection/>
            </div>
            <div ref={secondSectionRef}>
                <SecondSection/>
            </div>
            <div ref={aboutSectionRef}>
                <AboutSection/>
            </div>
            <div ref={projectLandingRef}>
                <ProjectLanding name={"PROJECTS"} ismain={true}/>
            </div>
            <div ref={projectsMenuRef}>
                <ProjectsMenu/>
            </div>

            {/* These sections are not part of the scroll-jacking effect */}
            {/* If you wanted to add them, you would wrap them in a div with a ref */}
            {/* and add that ref to the `sections` array above. */}
            <ProjectLanding name={"LOGO DESIGN"} ismain={false}/>
            {/* <ProjectGallery category={"logo-design"}/> */}
            <ProjectLanding name={"T-SHIRT DESIGN"} ismain={false}/>
            {/* ... other ProjectLanding sections ... */}
        </div>
    );
};