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
import ExtraMnemonicsModal from './ExtraMnemonicsModal'


// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// changeable constants
// const MAX_GPT_RUNS = 10
const MAX_HISTORY_LENGTH = 40
const TEXT_GENERATION_SLOWNESS = 5
const GPT_TEMPERATURE = 0.4

async function extraMnemonicsGPTCall(setExtraMnemonicsLoading, currentWord, setExtraMnemonics) {
    if (currentWord.word.trim() === "") { return }
    const options = { 
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a language learning tool that generates mnemonics and corresponding mental images for language learners to use to remember new vocabulary words. The user will give a vocabulary word and its translation. First, evaluate the word and its translation. Then, utilize the memory techniques Linkword Mnemonics and Elaborative Encoding to generate a mnemonic that is memorable, easy to recall, and has semantic similarity to the vocabulary word. Then, after you are done creating a mnemonic, generate a matching mental image that relates the mnemonic to the word's translation."
                },
                {
                    "role": "user",
                    "content": "Please generate and display several mnemonics and matching mental images to help me remember the Spanish vocabulary word 'beber', meaning 'to drink'."
                },
                {
                    "role": "function",
                    "name": "display_mnemonics",
                    "content": '{\n  \"word\": \"beber\",\n  \"translation\": \"to drink\",\n  \"mnemonics\": [\n    {\n      \"mnemonic\": \"beer bottle\",\n      \"mental_image\": \"A bottle of beer being poured into a mug for somebody to drink.\"\n    },\n    {\n      \"mnemonic\": \"Bieber\",\n      \"mental_image\": \"Justin Bieber drinking a glass of cold water as he prepares to go onstage.\"\n    },\n    {\n      \"mnemonic\": \"beaver\",\n      \"mental_image\": \"A beaver leaning over a river to drink its water.\"\n    },\n    {\n      \"mnemonic\": \"baby bear\",\n      \"mental_image\": \"A cute baby bear drinking from a glass.\"\n}'
                },
                {
                    "role": "user",
                    "content": `Please generate and display several mnemonics and matching mental images to help me remember the Spanish vocabulary word '${currentWord.word}', meaning '${currentWord.translation}'.`
                }
            ],
            "functions": [
                {
                    "name": "display_mnemonics",
                    "description": "Displays mnemonics and a mental image for each mnemonic to help retain and be able to recall the translation of the vocabulary word.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "word": {
                                "type": "string",
                                "description": "the vocabulary word."
                            },
                            "translation": {
                                "type": "string",
                                "description": "The word's translation."
                            },
                            "mnemonics": {
                                "type": "array",
                                "minItems": 3,
                                "maxItems": 5,
                                "uniqueItems": true,
                                "description": "An array of mnemonics and their matching mental image. Sorted by how good the mnemonic is for remembering the vocabulary word (the best mnemonic goes first).",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "mnemonic": {
                                            "type": "string",
                                            "description": "A short linkword mnemonic with semantic similarity to the vocabulary word. The mnemonic must be a valid word or phrase in English."
                                        },
                                        "mental_image": {
                                            "type": "string",
                                            "description": "A vivid mental image that relates the mnemonic to the word's translation using Linkword Mnemonics and Elaborative Encoding. One phrase or sentence. No letters or words are displayed within the mental image."
                                        }
                                    },
                                    "required": [
                                        "mnemonic",
                                        "mental_image"
                                    ]
                                }
                            }
                        },
                        "required": [
                            "word",
                            "translation",
                            "mnemonics"
                        ]
                    }
                }
            ],
            "max_tokens": 400,
            "temperature": 0.4,
            "function_call": {
                "name": "display_mnemonics"
            } 
        })
    }
    try {
        // Sending the API request and getting the response
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        console.log("FINISHED GPT MNEMONICS CALL.")
        const outputObj = JSON.parse(data.choices[0].message.function_call.arguments)
        setExtraMnemonics(outputObj.mnemonics)
        setExtraMnemonicsLoading(false)
    } catch(error) {
        console.error(error)
    }
}

// Calls makeGPTCall(), and also 
async function makeGPTCallWrapper(vocabWord, setIsLoading, setCurrentWord, 
    setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language, setShowWordInvalid=(() => {}),
    setSimilarWords=(() => {}), meaning="") {
    if (vocabWord.trim() === "") { return }
    setIsLoading(true)
    makeGPTCall(vocabWord, language, meaning)
        .then((outputObj) => {
            if (!outputObj.word_recognized) {
                // word not recognized, display modal
                setSimilarWords(outputObj.similar_words)
                if (setShowWordInvalid == null) { console.log("ERROR: setShowWordInvalidModal is null.") }
                setShowWordInvalid(true)
                setIsLoading(false)
                return
            }
            // if (vocabWord === "") { return }

            // parse output
            const newCurrent = {
                word: outputObj.word,
                translation: outputObj.translation,
                association: outputObj.mnemonic,
                mentalImage: outputObj.mental_image,
                explanation: outputObj.explanation,
                url: "",
                hasImage: false,
                language: language,
                pronunciation: outputObj.pronunciation ? outputObj.pronunciation : "",  // empty str if not found in output
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
        })
}

// GPT call to get the word mnemonic, mental image, etc.
async function makeGPTCall(vocabWord, language, meaning="") {
    // if (vocabWord.trim() === "") { return }
    // setIsLoading(true)
    console.log(`vocabWord: ${vocabWord}`)
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
        // console.log(outputObj)

        const invalidOutput = outputObj.word_recognized && (!outputObj || !outputObj.word || !outputObj.translation 
            || !outputObj.mnemonic || !outputObj.mental_image || !outputObj.explanation)
        if (invalidOutput) {
        console.log("INVALID OUTPUT!!! (word recognized and something is undefined)")
        }

        return outputObj

        // if (!outputObj.word_recognized) {
        //     // word invalid
        //     setSimilarWords(outputObj.similar_words)
        //     if (setShowWordInvalid == null) { console.log("ERROR: setShowWordInvalidModal is null.") }
        //     setShowWordInvalid(true)
        //     setIsLoading(false)
        //     return
        // }
        // await parseGPTOutput(outputObj, setCurrentWord, vocabWord,
        // setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language)
        } catch(error) {
            console.error(error);
    }
}

async function parseGPTOutput(outputObj, setCurrentWord, word,
    setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language) {
    if (word === "") { return }

    // const invalidOutput = (!outputObj || !outputObj.word || !outputObj.translation || !outputObj.mnemonic 
    //               || !outputObj.mental_image || !outputObj.explanation)
    // if (invalidOutput) {
    //     console.log("INVALID OUTPUT!!! (something is undefined)")
    // }

    const newCurrent = {
        word: outputObj.word,
        translation: outputObj.translation,
        association: outputObj.mnemonic,
        mentalImage: outputObj.mental_image,
        explanation: outputObj.explanation,
        url: "",
        hasImage: false,
        language: language,
        pronunciation: outputObj.pronunciation ? outputObj.pronunciation : "",  // empty str if not found in output
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
    // const [generatedWord, setGeneratedWord] = React.useState("")
    const [displayExtraMnemonics, setDisplayExtraMnemonics] = React.useState(false)
    const [extraMnemonicsLoading, setExtraMnemonicsLoading] = React.useState(false)
    const [extraMnemonics, setExtraMnemonics] = React.useState([])

    React.useEffect(() => {
        setVocabWord(currentWord.word)
        setIsLoading(false)

        console.log(`CURRENT WORD: '${currentWord.word}'`)
        if (currentWord.word.trim() !== "") {
            setExtraMnemonicsLoading(true)
            extraMnemonicsGPTCall(setExtraMnemonicsLoading, currentWord, setExtraMnemonics)
        }
    }, [currentWord])

    // React.useEffect(() => {
    //     if (generatedWord.trim() === "") { return }
    //     makeGPTCallWrapper(generatedWord, setIsLoading, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
    //         setHistory, setCurrentWordIndex, language)
    // }, [generatedWord])

    return (
        <div className="main-tool">
            <ToolTabs vocabWord={vocabWord} vocabWordInputRef={vocabWordInputRef} makeGPTCallWrapper={makeGPTCallWrapper}
                      setVocabWord={setVocabWord} setIsLoading={setIsLoading} numGPTRuns={numGPTRuns} setNumGPTRuns={setNumGPTRuns} 
                      setTriggerGeneration1={setTriggerGeneration1} setTriggerBlank={setTriggerBlank} setHistory={setHistory} 
                      setCurrentWordIndex={setCurrentWordIndex} language={language}
                      setIsGenerating={setIsGenerating} setCurrentWord={setCurrentWord}  makeGPTCall={makeGPTCall}
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
            <ExtraMnemonicsModal displayExtraMnemonics={displayExtraMnemonics} setDisplayExtraMnemonics={setDisplayExtraMnemonics}
                            extraMnemonicsLoading={extraMnemonicsLoading} currentWord={currentWord} extraMnemonics={extraMnemonics} />
        </div>
    )
}

export default MainTool
