import React from 'react'
// import './SoftwareResume.css'
import GreenNavbar from '../../components/GreenNavbar'
import musicResumePhoto from '../../pics/music_resume.jpg'
import Footer from '../../components/Footer'

function MusicResume() {
  return (
    <div className="software-resume">
        <GreenNavbar />
        <div className="software-page-content">
            <h1 className="software-resume-title">Recent Music Experience</h1>
            <img src={musicResumePhoto} alt="Etan's music resume" 
                className="resume-img"/>
        </div>
        <Footer />
    </div>
  )
}

export default MusicResume
