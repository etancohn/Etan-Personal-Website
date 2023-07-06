import React from 'react'
import GreenNavbar from '../../../components/GreenNavbar'
import Footer from '../../../components/Footer'
import './LinguaLink.css'
import SideBar from './SideBar.jsx'
import DescriptionHeader from './DescriptionHeader'
import MainTool from './MainTool'
import ImageGeneration from './ImageGeneration'

// // API Key for authentication
// const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

function LinguaLink() {

  const [history, setHistory] = React.useState([])
  const [currentWord, setCurrentWord] = React.useState(null)

  React.useEffect(() => {
    if (history.length > 0 && currentWord.word === history[history.length - 1].word) {
        return
    }
    if (currentWord !== null && currentWord.word !== "") {
        setHistory(prevHistory => [...prevHistory, currentWord])
    }
  }, [currentWord])

  // Load state from local storage on component mount
  React.useEffect(() => {
    const storedHistory = window.localStorage.getItem('history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  React.useEffect(() => {
    if( history !== []) {
        window.localStorage.setItem('history', JSON.stringify(history))
    }
  }, [history])

  return (
    <>
    <div className="lingua-link-content">
        <GreenNavbar />

        <div className="lingua-link-columns">
            <div className="lingua-link-sidebar">
                <SideBar history={history} setCurrentWord={setCurrentWord} />
            </div>

            <div className="ll-main-content">
                {/* logo and description */}
                {/* <DescriptionHeader /> */}
                <div className="description-header-container">
                    <DescriptionHeader />
                </div>

                <div className="main-tool-container">
                    <MainTool currentWord={currentWord} setCurrentWord={setCurrentWord} />
                </div>

                
                <div className="white-space-container"></div>

                <div className="image-generation-container">
                    <ImageGeneration currentWord={currentWord} setCurrentWord={setCurrentWord} />
                </div>

                <div className="language-container"></div>
                <div className="info-container"></div>
            </div>

        </div>
    </div>
    <Footer />
    </>
  )
}

export default LinguaLink
