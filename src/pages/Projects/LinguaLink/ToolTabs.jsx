import React from 'react'
import './ToolTabs.css'
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import LinguaGenerateRandom from './LinguaGenerateRandom'
import CloseButton from 'react-bootstrap/esm/CloseButton';
import WordNotFoundModal from './WordNotFoundModal';


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

function ToolTabs( {vocabWord, vocabWordInputRef, makeGPTCallWrapper, setVocabWord, setIsLoading, numGPTRuns,
                    setNumGPTRuns, setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language,
                    setIsGenerating, setCurrentWord, makeGPTCall, numHistoryClicks, setNumHistoryClicks, MAX_HISTORY_LENGTH,
                    setCursorLoading} ) {
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
                makeGPTCallWrapper(vocabWord, setIsLoading, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
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
                        Type in a {language} word below.
                    </h4>
                    <div className="ll-word-input-with-clear-container">
                        <input 
                            className="vocab-word-input"
                            type="text" 
                            placeholder={`ex: ${getExampleWord(language)}`} 
                            value={vocabWord}
                            ref={vocabWordInputRef}
                            onFocus={() => setVocabWordInputFocussed(true)}
                            // onBlur={() => {
                            //     setVocabWordInputFocussed(false)
                            // }}
                            onChange={(e) => setVocabWord(e.target.value)}>
                        </input>
                        {
                        vocabWordInputFocussed && vocabWord != "" && (
                            <CloseButton className="ll-reset-input-txt-btn" onClick={() => {
                                setVocabWord("")
                                vocabWordInputRef.current.focus()
                            }} />
                        )}
                    </div>
                    <button 
                        className="submit-btn ll-btn ll-tool-submit-btn"
                        onClick={() => makeGPTCallWrapper(vocabWord, setIsLoading, setCurrentWord, 
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
                    <LinguaGenerateRandom language={language} setIsGenerating={setIsGenerating}
                                            selectedDifficulty={selectedRadio} setIsLoading={setIsLoading} 
                                            triggerNewRandomWord={triggerNewRandomWord} setTriggerNewRandomWord={setTriggerNewRandomWord} 
                                            makeGPTCall={makeGPTCall} setCurrentWord={setCurrentWord} 
                                            numHistoryClicks={numHistoryClicks} setNumHistoryClicks={setNumHistoryClicks}
                                            setHistory={setHistory} setCurrentWordIndex={setCurrentWordIndex} 
                                            MAX_HISTORY_LENGTH={MAX_HISTORY_LENGTH} setCursorLoading={setCursorLoading}/>
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

        <WordNotFoundModal vocabWord={vocabWord} setVocabWord={setVocabWord} language={language} makeGPTCallWrapper={makeGPTCallWrapper} 
                setCurrentWord={setCurrentWord} setTriggerGeneration1={setTriggerGeneration1} setTriggerBlank={setTriggerBlank}
                setHistory={setHistory} setCurrentWordIndex={setCurrentWordIndex} showWordInvalidModal={showWordInvalidModal}
                setShowWordInvalidModal={setShowWordInvalidModal} similarWords={similarWords} setSimilarWords={setSimilarWords}
                setIsLoading={setIsLoading} />
        
    </>
    )
}

export default ToolTabs
