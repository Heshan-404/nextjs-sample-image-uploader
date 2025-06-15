
import React from "react";
import "./ProjectLanding.css";

function ProjectLanding(props) {
    return (
        <div className="project-landing-container d-flex justify-content-center align-items-center mt-5">
            <div
                className={`${props.ismain && "cliped-text-project-landing"} ${
                    !props.ismain && "cliped-text-project-landing-sub"
                }  dorsa-regular position-absolute`}
            >
                {props.name}
            </div>
            <div className="line-through-project-landing dorsa-regular position-absolute">
                {props.name}
            </div>
        </div>
    );
}

export default ProjectLanding;
