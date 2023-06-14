import React from 'react'
import './SoftwareResume.css'
import GreenNavbar from '../../components/GreenNavbar'
import softwareResumePhoto from '../../pics/software_resume.jpg'
import Footer from '../../components/Footer'

function SoftwareResume() {
  return (
    <div className="software-resume">
        <GreenNavbar />
        <div className="software-page-content">
            <h1 className="software-resume-title">Software Resume</h1>
            <img src={softwareResumePhoto} alt="Etan's software resume" 
                className="resume-img"/>
        </div>
        <Footer />
    </div>
  )
}

export default SoftwareResume
