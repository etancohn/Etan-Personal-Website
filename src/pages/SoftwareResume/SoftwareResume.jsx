import React from 'react'
import './SoftwareResume.css'
import GreenNavbar from '../../components/GreenNavbar'

function SoftwareResume() {
  return (
    <div className="software-resume">
        <GreenNavbar />
        <div className="software-page-content">
            <h1 className="software-resume-title">Software Resume</h1>
            <img src="/src/pics/software_resume.jpg" alt="Etan's software resume" 
                className="resume-img"/>
        </div>
    </div>
  )
}

export default SoftwareResume