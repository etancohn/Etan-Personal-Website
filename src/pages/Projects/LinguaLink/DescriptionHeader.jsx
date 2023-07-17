import React from 'react'
import './DescriptionHeader.css'
import main_logo from './pics/main_logo.png'

function DescriptionHeader() {
  return (
    <div className="logo-and-description">
        <img src={main_logo} alt="main Lingua Link logo" className="ll-main-logo" />
        <div className="ll-description-header-text">
          <h1 className="ll-main-title">UNLEASH YOUR <span className="title-bolded">MNEMONIC MIGHT!</span></h1>
          <p className="ll-project-description">
              Lingua Link deploys powerful memory techniques to enhance your ability to learn, remember, and 
              effortlessly recall new vocab words.
          </p>
        </div>
    </div>
  )
}

export default DescriptionHeader
