import { useState } from 'react'
import '../../global.css'
import './HomePage.css'
import Sidebar from './components/Sidebar.jsx'
import MainContent from './components/MainContent.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

function HomePage() {

  return (
    <div className="homepage-div">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <MainContent />
      </div>
    </div>
  )
}

export default HomePage
