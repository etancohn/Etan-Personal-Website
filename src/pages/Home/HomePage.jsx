import { useState } from 'react'
import '../../global.css'
import './HomePage.css'
import Sidebar from './components/Sidebar.jsx'
import MainContent from './components/MainContent.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import GreenNavbar from '../../components/GreenNavbar'
import Footer from '../../components/Footer'

function HomePage() {

  return (
    <>
      <div className="homepage-div">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="main-content">
          <GreenNavbar white={true}/>
          <MainContent />
          <Footer />
        </div>
      </div>
    </>
  )
}

export default HomePage
