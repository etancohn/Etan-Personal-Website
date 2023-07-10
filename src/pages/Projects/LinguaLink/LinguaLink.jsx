import React from 'react'
import GreenNavbar from '../../../components/GreenNavbar'
import Footer from '../../../components/Footer'
import './LinguaLink.css'
import SideBar from './SideBar.jsx'
import DescriptionHeader from './DescriptionHeader'
import MainTool from './MainTool'
import ImageGeneration from './ImageGeneration'
import InfoModal from './InfoModal'

// const MAX_HISTORY_STORED = 100

function LinguaLink() {

  const [history, setHistory] = React.useState([])
  const [numHistoryClicks, setNumHistoryClicks] = React.useState(0)
//   const [currentWord, setCurrentWord] = React.useState(null)
  const initialWord = {
    word: "",
    translation: "",
    association: "",
    mentalImage: "",
    explanation: "",
    url: ""
  }
  const [currentWord, setCurrentWord] = React.useState(initialWord)

//   React.useEffect(() => {
//     // if (history.length > 0 && currentWord.word === history[history.length - 1].word) {
//     //     return
//     // }
//     if (currentWord.word !== "") {
//         setHistory(prevHistory => [...prevHistory, currentWord])
//         // setHistory(prevHistory => {
//         //     let updated = prevHistory
//         // })
//     }
//   }, [currentWord])

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
            <div className="ll-main-content">
                <div className="lingua-link-sidebar">
                    <SideBar history={history} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks} 
                             setNumHistoryClicks={setNumHistoryClicks} />
                </div>

                {/* logo and description */}
                <div className="description-header-container">
                    <DescriptionHeader />
                </div>

                <div className="main-tool-container">
                    <MainTool currentWord={currentWord} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks}
                              setHistory={setHistory} />
                </div>
                
                <div className="white-space-container"></div>

                <div className="image-generation-container">
                    <ImageGeneration currentWord={currentWord} setCurrentWord={setCurrentWord} />
                    <div className="ll-separation-horizontal-line-container">
                        <div className="ll-separation-horizontal-line"></div>
                    </div>
                </div>

                <div className="info-container">
                    <InfoModal />
                </div>
                <div className="language-container"></div>
            </div>

        </div>
    <Footer />
    </>
  )
}

export default LinguaLink
