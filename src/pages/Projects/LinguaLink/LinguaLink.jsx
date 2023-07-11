import React from 'react'
import GreenNavbar from '../../../components/GreenNavbar'
import Footer from '../../../components/Footer'
import './LinguaLink.css'
import SideBar from './SideBar.jsx'
import DescriptionHeader from './DescriptionHeader'
import MainTool from './MainTool'
import ImageGeneration from './ImageGeneration'
import InfoModal from './InfoModal'
import PhoneHistory from './PhoneHistory'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBook } from '@fortawesome/free-solid-svg-icons';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import LinguaHistoryContent from './LinguaHistoryContent'


function LinguaLink() {

  const [history, setHistory] = React.useState([])
  const [numHistoryClicks, setNumHistoryClicks] = React.useState(0)
  const [currentWordIndex, setCurrentWordIndex] = React.useState(-1)
  const initialWord = {
    word: "",
    translation: "",
    association: "",
    mentalImage: "",
    explanation: "",
    url: ""
  }
  const [currentWord, setCurrentWord] = React.useState(initialWord)

  // const [showHistory, setShowHistory] = React.useState(false);
  // const handleCloseHistory = () => setShowHistory(false);
  // const handleShowHistory = () => setShowHistory(true);

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
        {/* <GreenNavbar white={true}/> */}
        <PhoneHistory history={history} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks} 
                      setNumHistoryClicks={setNumHistoryClicks} currentWordIndex={currentWordIndex} 
                      setCurrentWordIndex={setCurrentWordIndex} />
            {/* <FontAwesomeIcon className="ll-book-icon" icon={faBook} onClick={handleShowHistory} />
            <Modal show={showHistory} onHide={handleCloseHistory}>
              <Modal.Header closeButton>
                <Modal.Title>HISTORY</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <LinguaHistoryContent history={history} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks}
                                      setNumHistoryClicks={setNumHistoryClicks} currentWordIndex={currentWordIndex} 
                                      setCurrentWordIndex={setCurrentWordIndex} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseHistory}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal> */}

            <div className="ll-main-content">
                <div className="lingua-link-sidebar">
                    <SideBar history={history} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks} 
                             setNumHistoryClicks={setNumHistoryClicks} currentWordIndex={currentWordIndex} 
                             setCurrentWordIndex={setCurrentWordIndex} />
                </div>

                {/* logo and description */}
                <div className="description-header-container">
                    <DescriptionHeader />
                </div>

                <div className="main-tool-container">
                    <MainTool currentWord={currentWord} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks}
                              setHistory={setHistory} setCurrentWordIndex={setCurrentWordIndex} />
                </div>
                
                <div className="white-space-container"></div>

                <div className="image-generation-container">
                    <ImageGeneration currentWord={currentWord} setCurrentWord={setCurrentWord} setHistory={setHistory}
                                     currentWordIndex={currentWordIndex} />
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
