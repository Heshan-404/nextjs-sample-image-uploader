import React from "react";
import "./ProjectsMenu.css";

function ProjectsMenu() {

  return (
    <div className="d-flex justify-content-center align-items-center project-menu-container flex-column  ">
      <div className="project-menu-title dorsa-regular">PROJECTS</div>
      <div className="d-flex flex-column text-center gap-1 project-items-list ">
        <div className="project-menu-item  ">LOGO DESIGN</div>
        <div className="project-menu-item">T-SHIRT DESIGN</div>
        <div className="project-menu-item">SOCIAL MEDIA</div>
        <div className="project-menu-item">POSTER DESIGN</div>
        <div className="project-menu-item">COVER PAGE </div>
        <div className="project-menu-item">BRAND IDENTITY</div>
        <div className="project-menu-item">3D DESIGN</div>
        <div className="project-menu-item">OTHER DESIGN</div>
      </div>
    </div>
  );

}

export default ProjectsMenu;