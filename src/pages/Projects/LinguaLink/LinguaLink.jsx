import React from 'react'
// import GreenNavbar from '../../../components/GreenNavbar'
import Footer from '../../../components/Footer'
import './LinguaLink.css'
import DescriptionHeader from './DescriptionHeader'
import MainTool from './MainTool'
import ImageGeneration from './ImageGeneration'
import InfoModal from './InfoModal'
import PhoneHistory from './PhoneHistory'
import LLSidebar from './LLSidebar'
import Languages from './Languages'


function LinguaLink() {

  const [history, setHistory] = React.useState([])
  const [numHistoryClicks, setNumHistoryClicks] = React.useState(0)
  const [currentWordIndex, setCurrentWordIndex] = React.useState(-1)
  // const [generatedWord, setGeneratedWord] = React.useState("")
  const [language, setLanguage] = React.useState(localStorage.getItem("language") || "Spanish")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [showInfoModal, setShowInfoModal] = React.useState(false)
  const initialWord = {
    word: "",
    translation: "",
    association: "",
    mentalImage: "",
    explanation: "",
    url: "",
    hasImage: false,
    language: language
  }
  const [currentWord, setCurrentWord] = React.useState(initialWord)

  // Load state from local storage on component mount
  React.useEffect(() => {
    const storedHistory = window.localStorage.getItem('history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    } else {
      // new user
      setShowInfoModal(true)
    }
  }, []);

  React.useEffect(() => {
      window.localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  return (
    <>
    {isGenerating && <div className="wait-cursor"></div>}
    <div className="lingua-link-content">
        {/* <GreenNavbar white={true}/> */}
        <PhoneHistory history={history} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks} 
                      setNumHistoryClicks={setNumHistoryClicks} currentWordIndex={currentWordIndex} 
                      setCurrentWordIndex={setCurrentWordIndex} />

            <div className="ll-main-content">
                <div className="lingua-link-sidebar">
                    <LLSidebar history={history} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks} 
                             setNumHistoryClicks={setNumHistoryClicks} currentWordIndex={currentWordIndex} 
                             setCurrentWordIndex={setCurrentWordIndex} />
                </div>

                {/* logo and description */}
                <div className="description-header-container">
                    <DescriptionHeader />
                </div>

                <div className="main-tool-container">
                    <MainTool currentWord={currentWord} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks}
                              setHistory={setHistory} setCurrentWordIndex={setCurrentWordIndex}
                              language={language} setIsGenerating={setIsGenerating} />
                </div>
                
                <div className="white-space-container"></div>

                <div className="image-generation-container">
                    <ImageGeneration currentWord={currentWord} setCurrentWord={setCurrentWord} setHistory={setHistory}
                                     currentWordIndex={currentWordIndex} />
                    <div className="ll-separation-horizontal-line-container">
                        <div className="ll-separation-horizontal-line"></div>
                    </div>
                </div>

                <div className="language-container">
                  <Languages language={language} setLanguage={setLanguage} />
                  <div className="ll-separation-horizontal-line-container">
                        <div className="ll-separation-horizontal-line"></div>
                  </div>
                </div>

                <div className="info-container">
                    <InfoModal show1={showInfoModal} setShow1={setShowInfoModal} />
                </div>
            </div>

        </div>
    <Footer />
    </>
  )
}

export default LinguaLink
