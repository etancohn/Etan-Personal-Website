import React from 'react'
import './ToolTabs.css'
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import LinguaGenerateRandom from './LinguaGenerateRandom'

function ToolTabs( {vocabWord, vocabWordInputRef, makeGPTCall, setVocabWord, setIsLoading, numGPTRuns,
                    setNumGPTRuns, setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language,
                    setGeneratedWord, setIsGenerating, setCurrentWord} ) {
    const [selectedTab, setSelectedTab] = React.useState("enter-word")
    const [selectedRadio, setSelectedRadio] = React.useState("easy")
    const [vocabWordInputFocussed, setVocabWordInputFocussed] = React.useState(false)
    const [triggerNewRandomWord, setTriggerNewRandomWord] = React.useState(false)

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
                            setHistory, setCurrentWordIndex, language)
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
                    {/* <h4 className="project-mini-title ll-title">VOCAB WORD</h4> */}
                    <input 
                        className="vocab-word-input"
                        type="text" 
                        placeholder="ex: invierno" 
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
                                                language)}>
                            Submit
                    </button>
                </div>
                </Tab.Pane>

                {/* "generate random" tab */}
                <Tab.Pane eventKey="generate-random">
                    <div className="ll-generate-random-tab">
                
                    <h4 className="ll-description-generate-random">
                        Use the button below to generate a random {language} word. You may customize the difficulty of the 
                        words generated.
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

    )
}

export default ToolTabs
