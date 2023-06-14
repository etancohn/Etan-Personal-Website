import React from 'react'
import './ProjectsPage.css'
import GreenNavbar from '../../components/GreenNavbar'
import { websitesData } from '../../data/website-data.js'
import { useNavigate } from "react-router-dom"
import Footer from '../../components/Footer'

function ProjectsPage() {
  let navigate = useNavigate()
  return (
    <div className="projects-page">
      <GreenNavbar />
      <div className="projects-page-content">
            <h1 className="projects-page-title">Projects</h1>
            <p className="projects-page-description">Check out some of my web app projects below!</p>
            <div className="project-cards-container">
              {websitesData.map((website, i) => (
                <div className="project-card" key={i}>
                  <h4 className="project-card-title">{website.title}</h4>
                  <span className="project-card-horizontal-green-line"></span>
                  <p className="project-card-description">{website.description}</p>
                  {console.log(website.link)}
                  <button className="project-card-btn" onClick={() => navigate("../../" + website.link)}>Go To Page</button>
                </div>
              ))}
            </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProjectsPage
