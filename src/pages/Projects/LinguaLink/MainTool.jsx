import React from 'react'
import logo1 from './pics/logo_1.png'
import logo2 from './pics/logo_2.png'
import logo3 from './pics/logo_3.png'
import logo4 from './pics/logo_4.png'
import logo5 from './pics/logo_5.png'
import './MainTool.css'
import LinguaSingleOutput from './LinguaSingleOutput'
import ToolTabs from './ToolTabs'
import { mnemonicFunction } from './data/mnemonic-function.js'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import main_logo from './pics/main_logo.png'
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';



// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// changeable constants
const MAX_GPT_RUNS = 10
const MAX_HISTORY_LENGTH = 40
const TEXT_GENERATION_SLOWNESS = 5
const GPT_TEMPERATURE = 0.4

async function makeGPTCall(vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, 
    setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language, setShowWordInvalid=(() => {}),
    setSimilarWords=(() => {}), meaning="") {
    // // max re-runs of GPT hit
    // if (numGPTRuns+1 > MAX_GPT_RUNS) { 
    //     setIsLoading(false)
    //     const newCurrent = {
    //         word: vocabWord,
    //         translation: "An error has occurred. Please try submitting again.",
    //         association: " ",
    //         mentalImage: " ",
    //         explanation: " ",
    //         outputText: " ",
    //         url: "",
    //         language: ""
    //     }
    //     setCurrentWord(newCurrent)
    //     setNumGPTRuns(0)
    //     return
    // }
    setIsLoading(true)
    // Query string for the API request
    const systemMsgContent = import.meta.env.VITE_SYSTEM_MESSAGE_CONTENT
    const example1Prompt = import.meta.env.VITE_EXAMPLE_1_PROMPT
    const example1Response = import.meta.env.VITE_EXAMPLE_1_RESPONSE
    const example2Prompt = import.meta.env.VITE_EXAMPLE_2_PROMPT
    const example2Response = import.meta.env.VITE_EXAMPLE_2_RESPONSE
    const example3Prompt = import.meta.env.VITE_EXAMPLE_3_PROMPT
    const example3Response = import.meta.env.VITE_EXAMPLE_3_RESPONSE
    let userPrompt = import.meta.env.VITE_USER_PROMPT
    userPrompt = userPrompt.replace("--{language}--", language)
    if (meaning != "") {
        userPrompt = userPrompt.replace("--{vocabWord}--", `${vocabWord.trim()}, meaning '${meaning}'`)
    } else {
        userPrompt = userPrompt.replace("--{vocabWord}--", vocabWord.trim())
    }
    
    const options = { 
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                // GPT conversation
                {
                    "role": "system",
                    "content": systemMsgContent
                },
                {
                    "role": "user",
                    "content": example1Prompt
                },
                {
                    "role": "function",
                    "name": "display_mnemonic",
                    "content": example1Response
                },
                {
                    "role": "user",
                    "content": example2Prompt
                },
                {
                    "role": "function",
                    "name": "display_mnemonic",
                    "content": example2Response
                },
                {
                    "role": "user",
                    "content": example3Prompt
                },
                {
                    "role": "function",
                    "name": "display_mnemonic",
                    "content": example3Response
                },
                {
                    "role": "user",
                    "content": userPrompt
                }
            ],
            // GPT function inputs to generate
            "functions": [mnemonicFunction],
            "max_tokens": 400,
            "temperature": GPT_TEMPERATURE,
            "function_call": {
                "name": "display_mnemonic"
            }    
        })
    }
    try {
        // Sending the API request and getting the response
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();

        // Updating the output text with the received response
        const outputObj = JSON.parse(data.choices[0].message.function_call.arguments)
        console.log(outputObj)

        console.log(`recognized: ${outputObj.word_recognized}`)
        if (!outputObj.word_recognized) {
            // word invalid
            console.log("NOT RECOGNIZED")
            setSimilarWords(outputObj.similar_words)
            for (let i = 0; i < outputObj.similar_words.length; i++) {
                console.log(`${outputObj.similar_words[i].possible_word} - ${outputObj.similar_words[i].possible_word_translation}`)
            }

            if (setShowWordInvalid == null) {
                console.log("ERROR: setShowWordInvalidModal is null.")
            }
            setShowWordInvalid(true)
            
            // alert("Sorry, your word was not found! Try again or try a different word.")
            setIsLoading(false)
            return
        }
        await parseGPTOutput(outputObj, setCurrentWord, vocabWord,
        setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language)
        } catch(error) {
            console.error(error);
    }
}

async function parseGPTOutput(outputObj, setCurrentWord, word,
    setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language) {
    // console.log(outputObj)
    if (word === "") { return }

    const invalidOutput = (!outputObj || !outputObj.word || !outputObj.translation || !outputObj.mnemonic 
                  || !outputObj.mental_image || !outputObj.explanation || !outputObj.pronunciation)
    if (invalidOutput) {
        console.log("INVALID OUTPUT!!! (something is undefined)")
    }

    const newCurrent = {
        word: outputObj.word,
        translation: outputObj.translation,
        association: outputObj.mnemonic,
        mentalImage: outputObj.mental_image,
        explanation: outputObj.explanation,
        url: "",
        hasImage: false,
        language: language,
        pronunciation: outputObj.pronunciation,
        infinitive: outputObj.is_verb ? outputObj.infinitive : ""
    }

    setHistory(prevHistory => {
        let updatedHistory = [...prevHistory, newCurrent]
        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
            updatedHistory = updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH, updatedHistory.length)
        }
        setCurrentWordIndex(updatedHistory.length - 1)
        return updatedHistory
        })
    setCurrentWord(newCurrent)
    setTriggerBlank(true)
    setTriggerGeneration1(true)
}


// const llOutputInvalid = (translation === '' || association === '' 
//     || mentalImage === '' || explanation === '')

// if (llOutputInvalid) {
//     await setNumGPTRuns(numGPTRuns+1)
//     console.log(`INVALID - RERUN ("${word}") (${numGPTRuns+1})`)
//     await makeGPTCall(word, setIsLoading, numGPTRuns+1, setNumGPTRuns, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
//     setHistory, setCurrentWordIndex, language)
//     return
// } 


function resetTriggers(setTriggerGeneration1, setTriggerGeneration2, setTriggerGeneration3, setTriggerGeneration4, 
                       setTriggerGeneration5, setTriggerBlank, setTriggerGenerationInfinitive) {
    setTriggerGeneration1(false)
    setTriggerGeneration2(false)
    setTriggerGeneration3(false)
    setTriggerGeneration4(false)
    setTriggerGeneration5(false)
    setTriggerGenerationInfinitive(false)
    setTriggerBlank(false)
}

function MainTool( {currentWord, setCurrentWord, numHistoryClicks, setHistory, setCurrentWordIndex,
                    language, setIsGenerating} ) {
    const [vocabWord, setVocabWord] = React.useState("")
    const vocabWordInputRef = React.useRef(null);
    const [numGPTRuns, setNumGPTRuns] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)
    const [triggerGeneration1, setTriggerGeneration1] = React.useState(false)
    const [triggerGenerationInfinitive, setTriggerGenerationInfinitive] = React.useState(false)
    const [triggerGeneration2, setTriggerGeneration2] = React.useState(false)
    const [triggerGeneration3, setTriggerGeneration3] = React.useState(false)
    const [triggerGeneration4, setTriggerGeneration4] = React.useState(false)
    const [triggerGeneration5, setTriggerGeneration5] = React.useState(false)
    const [triggerBlank, setTriggerBlank] = React.useState(false)
    const [generatedWord, setGeneratedWord] = React.useState("")
    const [displayExtraMnemonics, setDisplayExtraMnemonics] = React.useState(false)
    const [extraMnemonicsLoading, setExtraMnemonicsLoading] = React.useState(false)

    React.useEffect(() => {
        setVocabWord(currentWord.word)
        setIsLoading(false)
    }, [currentWord])

    React.useEffect(() => {
        if (generatedWord.trim() === "") { return }
        makeGPTCall(generatedWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
            setHistory, setCurrentWordIndex, language)
    }, [generatedWord])

    React.useEffect(() => {
        if (displayExtraMnemonics) {
            console.log("clicked.")
            setExtraMnemonicsLoading(true)
            setTimeout(() => {
                console.log("done.")
                setExtraMnemonicsLoading(false)
            }, 2000)
        }
    }, [displayExtraMnemonics])

    return (
        <div className="main-tool">
            <ToolTabs vocabWord={vocabWord} vocabWordInputRef={vocabWordInputRef} makeGPTCall={makeGPTCall}
                      setVocabWord={setVocabWord} setIsLoading={setIsLoading} numGPTRuns={numGPTRuns} setNumGPTRuns={setNumGPTRuns} 
                      setTriggerGeneration1={setTriggerGeneration1} setTriggerBlank={setTriggerBlank} setHistory={setHistory} 
                      setCurrentWordIndex={setCurrentWordIndex} language={language} setGeneratedWord={setGeneratedWord} 
                      setIsGenerating={setIsGenerating} setCurrentWord={setCurrentWord} 
                    //   showWordInvalidModal={showWordInvalidModal} setShowWordInvalidModal={setShowWordInvalidModal} 
                      />

            {/* output boxes */} 
            <div className={`ll-output-box-container ll-output-is-loading-${isLoading}`}>
                <LinguaSingleOutput logo={logo1} title="YOUR WORD" 
                                    text={currentWord.pronunciation === "" ? `${currentWord.word}` : `${currentWord.word} (${currentWord.pronunciation})`} 
                                    num="1" triggerGeneration={triggerGeneration1}
                                    onCompletion={() => currentWord.infinitive === "" ? setTriggerGeneration2(true) : setTriggerGenerationInfinitive(true) } 
                                    triggerBlank={triggerBlank} 
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS}
                                    language={language} currentWord={currentWord} infinitive={currentWord.infinitive}
                                    secondTriggerGeneration={triggerGenerationInfinitive} 
                                    secondOnCompletion={() => setTriggerGeneration2(true)} />
                <LinguaSingleOutput logo={logo2} title="TRANSLATION" text={currentWord.translation} 
                                    num="2" triggerGeneration={triggerGeneration2}
                                    onCompletion={() => setTriggerGeneration3(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS}
                                    language={language} currentWord={currentWord} />
                <LinguaSingleOutput logo={logo3} title="MNEMONIC" text={currentWord.association} 
                                    num="3" triggerGeneration={triggerGeneration3}
                                    onCompletion={() => setTriggerGeneration4(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS}
                                    language={language} currentWord={currentWord} setDisplayExtraMnemonics={setDisplayExtraMnemonics} />
                <LinguaSingleOutput logo={logo4} title="MENTAL IMAGE" text={currentWord.mentalImage} 
                                    num="4" triggerGeneration={triggerGeneration4} 
                                    onCompletion={() => setTriggerGeneration5(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS}
                                    language={language} currentWord={currentWord} />
                <LinguaSingleOutput logo={logo5} title="EXPLANATION" text={currentWord.explanation} 
                                    num="5" triggerGeneration={triggerGeneration5}
                                    onCompletion={() => resetTriggers(setTriggerGeneration1, setTriggerGeneration2, setTriggerGeneration3,
                                                        setTriggerGeneration4, setTriggerGeneration5, setTriggerBlank, setTriggerGenerationInfinitive)} 
                                    triggerBlank={triggerBlank} numHistoryClicks={numHistoryClicks} 
                                    TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS} language={language} currentWord={currentWord} />
            </div> 
            <Modal
                show={displayExtraMnemonics}
                onHide={() => setDisplayExtraMnemonics(false)}
                size='lg'
                backdrop="static"
                keyboard={false}
                className="ll-modals"
            >
                <Modal.Header closeButton>
                    <div className="ll-modal-header-container">
                        <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
                        <Modal.Title className="ll-info-modal-title">EXTRA MNEMONICS</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body className="ll-info-modal-body">
                    <Table bordered hover size="lg" striped 
                    className={`ll-extra-mnemonics-tbl-loading-${extraMnemonicsLoading}`}
                    >
                        <thead className="ll-modal-tbl-header">
                            <tr className={`ll-extra-mnemonics-tbl-loading-${extraMnemonicsLoading}`}>
                                <td>Mnemonic</td>
                                <td>Mental Image</td>
                            </tr>
                        </thead>

                        
                        {/* <tbody>
                        {
                            similarWords.map((word, index) => (  
                                <tr key={index} className="ll-modal-tbl-row" 
                                onClick={() => {
                                    setShowWordInvalidModal(false)
                                    setVocabWord(word.possible_word)
                                    makeGPTCall(word.possible_word, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, 
                                        setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex,
                                        language, setShowWordInvalidModal, setSimilarWords, word.possible_word_translation)
                                    }
                                }
                                >
                                    <td>{word.possible_word}</td>
                                    <td>{word.possible_word_translation}</td>
                                </tr>                         
                            ))
                        }
                        </tbody> */}
                    </Table>
                    <Spinner className={`ll-loading-spinner-${extraMnemonicsLoading}`} />
                    {/* <div>
                    </div> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setDisplayExtraMnemonics(false)} className='ll-info-modal-continue-btn'>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default MainTool
