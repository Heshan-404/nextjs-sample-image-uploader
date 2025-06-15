// This is a Server Component, so "use client" is not needed or recommended.
import React from "react";
import Image from "next/image"; // For optimized images
import "./header.css";       // Import the corresponding stylesheet

// Import Font Awesome components and icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faBehance,
    faLinkedin,
    faInstagram,
    faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

function Header() {
    return (
        <div>
            <a className="navbar-brand z-3 position-fixed" href="#">
                {/* 
                  - Use the <Image> component for optimization.
                  - The src path starts from the /public folder.
                  - The stray semicolon has been removed. 
                */}
                <Image src="/assets/react.svg" width={30} height={30} alt="Logo" />
            </a>

            {/* 
              - ADDED "navbar-dark" here. This is the main fix to make the 
                hamburger icon white and visible on your dark navbar.
            */}
            <nav className="navbar navbar-dark navbar-expand-lg position-fixed z-2 w-100">
                <button
                    className="navbar-toggle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav d-flex align-items-center">
                        <a className="nav-item" href="#">
                            START
                        </a>
                        <a className="nav-item" href="#">
                            ABOUT
                        </a>
                        <a className="nav-item" href="#">
                            PROJECTS
                        </a>
                        <a className="nav-item disabled" href="#">
                            CONTACT
                        </a>
                        <div className="navbar-contact justify-content-center align-items-end">
                            <div className="d-flex justify-content-between w-50">
                                <div className="social-icon-btn">
                                    <FontAwesomeIcon
                                        icon={faFacebook}
                                        className="social-icon social-icon-1"
                                    />
                                </div>
                                <div className="social-icon-btn">
                                    <FontAwesomeIcon
                                        icon={faBehance}
                                        className="social-icon social-icon-2"
                                    />
                                </div>
                                <div className="social-icon-btn">
                                    <FontAwesomeIcon
                                        icon={faLinkedin}
                                        className="social-icon social-icon-3"
                                    />
                                </div>
                                <div className="social-icon-btn">
                                    <FontAwesomeIcon
                                        icon={faInstagram}
                                        className="social-icon social-icon-4"
                                    />
                                </div>
                                <div className="social-icon-btn">
                                    <FontAwesomeIcon
                                        icon={faPinterest}
                                        className="social-icon social-icon-5"
                                    />
                                </div>
                                <div className="social-icon-btn">
                                    <FontAwesomeIcon
                                        icon={faPrint}
                                        className="social-icon social-icon-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;