import React from 'react'
import './DescriptionHeader.css'
import main_logo from '../../../pics/LinguaLink/main_logo.png'

function DescriptionHeader() {
  return (
    <div className="logo-and-description">
        <img src={main_logo} alt="main Lingua Link logo" className="ll-main-logo" />
        <p className="ll-project-description">
            Elevate your Spanish vocabulary learning experience! Lingua Link deploys powerful memory techniques 
            to enhance your ability to learn, remember, and effortlessly recall new Spanish vocab words.
        </p>
    </div>
  )
}

export default DescriptionHeader
