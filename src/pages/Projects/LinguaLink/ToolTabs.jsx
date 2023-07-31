import React from 'react'
import './ToolTabs.css'
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import LinguaGenerateRandom from './LinguaGenerateRandom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import main_logo from './pics/main_logo.png'
import Table from 'react-bootstrap/Table';


function getExampleWord(language) {
    if (language === "Spanish") { return "rana" }
    else if (language === "Hebrew") { return "מחשב" }
    else if (language === "Russian") { return "наука" }
    else if (language === "German") { return "prüfung" }
    else if (language === "Portuguese") { return "cotidiano" }
    else if (language === "French") { return "ordinateur" }
    else if (language === "Japanese") { return "討論" }
    else if (language === "Dutch") { return "geweldig" }
    else if (language === "Korean") { return "전략" }
    else if (language === "Chinese") { return "选择" }
    else if (language === "Italian") { return "avanti" }
    else if (language === "Arabic") { return "رَائِعٌ" }
    else return ("(error)")
}

function ToolTabs( {vocabWord, vocabWordInputRef, makeGPTCall, setVocabWord, setIsLoading, numGPTRuns,
                    setNumGPTRuns, setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language,
                    setGeneratedWord, setIsGenerating, setCurrentWord} ) {
    const [selectedTab, setSelectedTab] = React.useState("enter-word")
    const [selectedRadio, setSelectedRadio] = React.useState("easy")
    const [vocabWordInputFocussed, setVocabWordInputFocussed] = React.useState(false)
    const [triggerNewRandomWord, setTriggerNewRandomWord] = React.useState(false)
    const [showWordInvalidModal, setShowWordInvalidModal] = React.useState(false)
    const [similarWords, setSimilarWords] = React.useState([])

    // handle user pushing 'Enter'
    const handleKeyPressed = (e) => {
        if (e.key === 'Enter') {
            // if enter is pushed in "generate random word" tab: generate new word
            if (selectedTab === "generate-random") {
                setTriggerNewRandomWord(true)
                return
            }
            // if enter is pushed in "enter word" tab: either change focus to vocab word input or make API call
            if (vocabWordInputFocussed) {   
                makeGPTCall(vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
                            setHistory, setCurrentWordIndex, language, setShowWordInvalidModal, setSimilarWords)
                vocabWordInputRef.current.blur()   // unfocus
            } else  {
                vocabWordInputRef.current.focus()
            }
        }
    }
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyPressed)

        return () => {
        // cleanup
        document.removeEventListener('keydown', handleKeyPressed)
        }
    })

    return (
        <>
        <Tab.Container defaultActiveKey="enter-word">
            <Nav variant="tabs" fill className="mb-3 ll-nav-tabs" onSelect={(tabName) => setSelectedTab(tabName)}>
                <Nav.Item className="ll-tool-nav-item">
                    <Nav.Link eventKey="enter-word" className={`ll-selected-tab-${selectedTab === "enter-word"}`}>
                        Enter Word
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="ll-tool-nav-item">
                    <Nav.Link eventKey="generate-random" className={`ll-selected-tab-${selectedTab === "generate-random"}`}>
                        Generate Random
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* "enter word" tab */}
            <Tab.Content>
                <Tab.Pane eventKey="enter-word" className="justify-content-center">
                <div className="vocab-input-container">
                    <h4 className="ll-description-enter-word">
                        Type in a {language} word below. (You can change the language in the language settings.)
                    </h4>
                    {/* <h4 className="project-mini-title ll-title">VOCAB WORD</h4> */}
                    <input 
                        className="vocab-word-input"
                        type="text" 
                        placeholder={`ex: ${getExampleWord(language)}`} 
                        value={vocabWord}
                        ref={vocabWordInputRef}
                        onFocus={() => setVocabWordInputFocussed(true)}
                        onBlur={() => setVocabWordInputFocussed(false)}
                        onChange={(e) => setVocabWord(e.target.value)}>
                    </input>
                    <button 
                        className="submit-btn ll-btn ll-tool-submit-btn"
                        onClick={() => makeGPTCall(vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, 
                                                setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex,
                                                language, setShowWordInvalidModal, setSimilarWords)}>
                            Submit
                    </button>
                </div>
                </Tab.Pane>

                {/* "generate random" tab */}
                <Tab.Pane eventKey="generate-random">
                    <div className="ll-generate-random-tab">
                
                    <h4 className="ll-description-generate-random">
                        Use the button below to generate a random {language} word.
                    </h4>
                    <LinguaGenerateRandom setGeneratedWord={setGeneratedWord} language={language} setIsGenerating={setIsGenerating}
                                            selectedDifficulty={selectedRadio} setIsLoading={setIsLoading} 
                                            triggerNewRandomWord={triggerNewRandomWord} setTriggerNewRandomWord={setTriggerNewRandomWord} />
                        <div className="ll-radio-input">
                            <div className="ll-radio-btns-container">
                                <div className="ll-radio-btns-text">Word Difficulty: </div>
                                <div className="ll-radio-btn-container">
                                    <div className={`ll-radio-btn-outer-circle ll-radio-btn-selected-${selectedRadio === "easy"}`}
                                            onClick={() => setSelectedRadio("easy")}>
                                        <div className={`ll-radio-inner-circle ll-radio-inner-circle-selected-${selectedRadio === "easy"}`}></div>
                                    </div>
                                    <div>Easy</div>
                                </div>

                                <div className="ll-radio-btn-container">
                                    <div className={`ll-radio-btn-outer-circle ll-radio-btn-selected-${selectedRadio === "hard"}`}
                                            onClick={() => setSelectedRadio("hard")}>
                                        <div className={`ll-radio-inner-circle ll-radio-inner-circle-selected-${selectedRadio === "hard"}`}></div>
                                    </div>
                                    <div>Hard</div>
                                </div>
                            </div>
                        </div>
                        </div>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>

        {/* word not found modal */}
        <Modal
            show={showWordInvalidModal}
            onHide={() => setShowWordInvalidModal(false)}
            size='lg'
            backdrop="static"
            keyboard={false}
            className="ll-modals"
        >
            <Modal.Header closeButton>
                <div className="ll-modal-header-container">
                    <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
                    <Modal.Title className="ll-info-modal-title">WORD NOT FOUND</Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body className="ll-info-modal-body">
                <p>
                    Word <span className="ll-bold">'{vocabWord}'</span> not found in {language}. Similar words:
                </p>
                <div>
                    <Table bordered hover size="lg" striped>
                        <thead>
                            <tr>
                                <td>Word</td>
                                <td>Translation</td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            similarWords.map((word, index) => (  
                                <tr key={index}>
                                    <td>{word.possible_word}</td>
                                    <td>{word.possible_word_translation}</td>
                                </tr>                         
                                // <div key={index}>{`${word.possible_word}: ${word.possible_word_translation}`}</div>
                            ))
                        }
                        </tbody>
                    </Table>
                </div>
                {/* <p>
                    <span className="ll-bold">Welcome to Lingua Link!</span> Elevate your language learning experience to new heights through the fusion of 
                    powerful memory techniques with cutting-edge AI technology.
                </p> */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => setShowWordInvalidModal(false)} className='ll-info-modal-continue-btn'>
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    )
}

export default ToolTabs
