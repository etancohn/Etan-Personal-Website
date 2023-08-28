import React, { startTransition } from 'react'
import './LinguaGenerateRandom.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import main_logo from './pics/main_logo.png'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const NUM_WORDS_TO_GENERATE = 50
const MAX_WORD_GENERATION_GPT_RUNS = 10
const GPT_TEMPERATURE = 0.9
const GEN_WORDS_REFILL_LIMIT = 10   // limit of amount of easy or hard words stored before refilling
const GEN_WORDS_STORED_LIMIT = 80  // max amount of easy or hard words stored
const READY_GENERATED_WORDS_REFILL_LIMIT = 5 // amount of ready mnemonics left before getting more mnemonics in background
const MNEMONICS_REFILL_AMT = 6 // amount of words to get mnemonics for at a time
const START_MNEMONICS_AMT = 3  // mnemonics to start out with when initializing

// Fisher Yates shuffle algo
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

async function generateRandomWordsGPT(language) {
    console.log("generating words...")
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
                    "content": `You are a language learning tool that generates vocabulary words. The user specify what language they are learning. Then, you will generate and display two lists of vocabulary words in that language: One contains ${NUM_WORDS_TO_GENERATE} basic/beginner vocabulary words, and the other contains ${NUM_WORDS_TO_GENERATE} intermediate to expert level words.`
                },
                {
                    "role": "user",
                    "content": `Please generate and display ${language} vocabulary words.`
                }
            ],
            "functions": [
                {
                    "name": "display_vocabulary",
                    "description": "Displays two sets of vocabulary words: Beginner and advanced.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "language": {
                                "type": "string",
                                "description": "The language of the vocabulary words."
                            },
                            "beginner_vocabulary": {
                                "type": "array",
                                "minItems": NUM_WORDS_TO_GENERATE,
                                "maxItems": NUM_WORDS_TO_GENERATE,
                                "uniqueItems": true,
                                "description": "Vocabulary words of basic/beginner difficulty.",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "advanced_vocabulary": {
                                "type": "array",
                                "minItems": NUM_WORDS_TO_GENERATE,
                                "maxItems": NUM_WORDS_TO_GENERATE,
                                "uniqueItems": true,
                                "description": "Vocabulary words of intermediate and expert difficulty.",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "language",
                            "beginner_vocabulary",
                            "advanced_vocabulary"
                        ]
                    }
                }
            ],
            "max_tokens": 2000,
            "temperature": GPT_TEMPERATURE,
            "function_call": {
                "name": "display_vocabulary"
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
        console.log("done generating.")
        return outputObj
    } catch(error) {
        console.error(error)
    }
}

function enqueue(queue, items, maxSize=null) {
    let res = [...queue, ...items]
    if (maxSize) {
        res = res.slice(0, maxSize)
    }
    return res
}

// function dequeue(queue) {
//     if (queue.length < 1) {
//         console.log("CAN'T DEQUEUE FROM EMPTY QUEUE")
//         return
//     }
//     const lastElem = queue[queue.length - 1]
//     const updatedQueue = queue.slice(0, queue.length-1)
//     res = [lastElem, updatedQueue]
// }

function LinguaGenerateRandom( {language, selectedDifficulty, makeGPTCall, setCurrentWord,
                            numHistoryClicks, setNumHistoryClicks, setHistory, setCurrentWordIndex, MAX_HISTORY_LENGTH,
                            setCursorLoading} ) {
    const initialGeneratedWords = {
        easy: [], 
        hard: []
    }
    const [generatedWords, setGeneratedWords] = React.useState(initialGeneratedWords)
    const [easyQueue, setEasyQueue] = React.useState([])
    const [hardQueue, setHardQueue] = React.useState([])
    const [newEasyQueueItems, setNewEasyQueueItems] = React.useState([])
    const [newHardQueueItems, setNewHardQueueItems] = React.useState([])
    const [newGeneratedWords, setNewGeneratedWords] = React.useState(initialGeneratedWords)
    const [refilling, setRefilling] = React.useState(false)
    const [showGenWordErrorModal, setShowGenWordErrorModal] = React.useState(false)

    const hasInitialized = React.useRef(false)

    function setWord(outputObj) {
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
        setCurrentWord(newCurrent)
        setNumHistoryClicks(numHistoryClicks+1)
        setHistory(prevHistory => {
            let updatedHistory = [...prevHistory, newCurrent]
            if (updatedHistory.length > MAX_HISTORY_LENGTH) {
                updatedHistory = updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH, updatedHistory.length)
            }
            setCurrentWordIndex(updatedHistory.length - 1)
            return updatedHistory
        })

    }

    // get next ready mnemonic 
    async function getRandomWord() {
        let word, updatedEasyQueue, updatedHardQueue
        console.log("generatedWords:")
        console.log(generatedWords)
        console.log("easyQueue:")
        console.log(easyQueue)
        console.log("hardQueue:")
        console.log(hardQueue)

        function invalid() {
            const res = !easyQueue || !hardQueue || easyQueue.length === 0 || hardQueue.length === 0
            return res
        }

        if (invalid()) {
            setShowGenWordErrorModal(true)
            if (!easyQueue || !hardQueue) {
                initialize()
            }
            return
        }

        if (selectedDifficulty === "easy") {
            if (easyQueue.length > 0) {
                word = easyQueue[0]
                updatedEasyQueue = easyQueue.slice(1)
                setEasyQueue(updatedEasyQueue)
                window.localStorage.setItem("easyQueue", JSON.stringify(updatedEasyQueue))
                setWord(word)
            }

            if (!refilling && easyQueue.length - 1 <= READY_GENERATED_WORDS_REFILL_LIMIT) {
                // refill Easy Queue
                console.log("--- REFILLING EASY QUEUE!!! ---")
                const newMnemonics = refillQueue(generatedWords, "easy")
                setNewEasyQueueItems(newMnemonics)
            }
        } else if (selectedDifficulty === "hard") {
            if (hardQueue.length > 0) {
                word = hardQueue[0]
                updatedHardQueue = hardQueue.slice(1)
                setHardQueue(updatedHardQueue)
                window.localStorage.setItem("hardQueue", JSON.stringify(updatedHardQueue))
                setWord(word)
            }

            if (!refilling && hardQueue.length - 1 <= READY_GENERATED_WORDS_REFILL_LIMIT) {
                // refill Hard Queue
                console.log("--- REFILLING HARD QUEUE!!! ---")
                const newMnemonics = refillQueue(generatedWords, "hard")
                setNewHardQueueItems(newMnemonics)
            }
        }
        return
    }

    async function refillQueue(currentGeneratedWords, difficulty=undefined) {
        setRefilling(true)
        let wordDifficulty = difficulty
        if (!difficulty) {
            wordDifficulty = selectedDifficulty
        }
        console.log('getting mnemonics...')
        let firstWords, newMnemonics, otherWords, updatedGeneratedWords
        if (wordDifficulty === "easy") {
            firstWords = currentGeneratedWords.easy.slice(0, MNEMONICS_REFILL_AMT)
            newMnemonics = await Promise.all(firstWords.map(vocabWord => makeGPTCall(vocabWord, language)))
            setNewEasyQueueItems(newMnemonics)
            otherWords = currentGeneratedWords.easy.slice(MNEMONICS_REFILL_AMT)
            updatedGeneratedWords = {
                ...currentGeneratedWords,
                easy: otherWords
            }
            setGeneratedWords(updatedGeneratedWords)
            window.localStorage.setItem("generatedWords", JSON.stringify(updatedGeneratedWords))
        } else if (wordDifficulty === "hard") {
            firstWords = currentGeneratedWords.hard.slice(0, MNEMONICS_REFILL_AMT)
            newMnemonics = await Promise.all(firstWords.map(vocabWord => makeGPTCall(vocabWord, language)))
            setNewHardQueueItems(newMnemonics)
            otherWords = currentGeneratedWords.hard.slice(MNEMONICS_REFILL_AMT)
            updatedGeneratedWords = {
                ...currentGeneratedWords,
                hard: otherWords
            }
            setGeneratedWords(updatedGeneratedWords)
            window.localStorage.setItem("generatedWords", JSON.stringify(updatedGeneratedWords))
        }

        if (otherWords.length < GEN_WORDS_REFILL_LIMIT) {
            console.log("--- refilling generated words!!! ----")
            const newWordsObj = await generateRandomWordsGPT(language)
            const newWords = {
                easy: newWordsObj.beginner_vocabulary,
                hard: newWordsObj.advanced_vocabulary
            }
            shuffleArray(newWords.easy)
            shuffleArray(newWords.hard)
            setNewGeneratedWords(newWords)
        } 
        setRefilling(false)
        return newMnemonics
    }

    async function initialize() {
        setEasyQueue([])
        setHardQueue([])
        setGeneratedWords(initialGeneratedWords)
        const newWordsObj = await generateRandomWordsGPT(language)
        shuffleArray(newWordsObj.beginner_vocabulary)
        shuffleArray(newWordsObj.advanced_vocabulary)

        const firstEasyWords = newWordsObj.beginner_vocabulary.slice(0, START_MNEMONICS_AMT)
        const firstHardWords = newWordsObj.advanced_vocabulary.slice(0, START_MNEMONICS_AMT)

        const [easyMnemonics, hardMnemonics] = await Promise.all([
            Promise.all(firstEasyWords.map(vocabWord => makeGPTCall(vocabWord, language))),
            Promise.all(firstHardWords.map(vocabWord => makeGPTCall(vocabWord, language)))
        ])

        setEasyQueue([])
        setNewEasyQueueItems(easyMnemonics)
        const otherEasyWords = newWordsObj.beginner_vocabulary.slice(START_MNEMONICS_AMT)

        setHardQueue([])
        setNewHardQueueItems(hardMnemonics)
        const otherHardWords = newWordsObj.advanced_vocabulary.slice(START_MNEMONICS_AMT)

        const newWords = {
            easy: otherEasyWords,
            hard: otherHardWords
        }
        console.log("initialized.")
        setGeneratedWords(initialGeneratedWords)
        setNewGeneratedWords(newWords)
    }

    React.useEffect(() => {
        const storedLanguage = window.localStorage.getItem("prevLanguage")
        if (!storedLanguage) {
            window.localStorage.setItem("prevLanguage", language)
            return
        }
        if (storedLanguage !== language) {
            console.log(`LANGUAGE CHANGE: ${language}`)
            window.localStorage.setItem("prevLanguage", language)
            initialize()
        }
    }, [language])

    React.useEffect(() => {
        if (newEasyQueueItems.length > 0) {
            const newEasyQueue = enqueue(easyQueue, newEasyQueueItems)
            setEasyQueue(newEasyQueue)
            window.localStorage.setItem("easyQueue", JSON.stringify(newEasyQueue))
        }
    }, [newEasyQueueItems])

    React.useEffect(() => {
        if (newHardQueueItems.length > 0) {
            const newHardQueue = enqueue(hardQueue, newHardQueueItems)
            setHardQueue(newHardQueue)
            window.localStorage.setItem("hardQueue", JSON.stringify(newHardQueue))
        }
    }, [newHardQueueItems])

    React.useEffect(() => {
        if (newGeneratedWords.easy.length > 0 || newGeneratedWords.hard.length > 0) {
            const newEasy = enqueue(generatedWords.easy, newGeneratedWords.easy, GEN_WORDS_STORED_LIMIT)
            const newHard = enqueue(generatedWords.hard, newGeneratedWords.hard, GEN_WORDS_STORED_LIMIT)
            // TODO: shuffle words
            const updatedGeneratedWords = {
                easy: newEasy,
                hard: newHard
            }
            setGeneratedWords(updatedGeneratedWords)
            window.localStorage.setItem("generatedWords", JSON.stringify(updatedGeneratedWords))
        }
    }, [newGeneratedWords])

    // initialize generatedWords and mnemonicQueues on mount
    React.useEffect(() => {
        // avoid re-render (otherwise it runs this code twice)
        if (!hasInitialized.current) {
            hasInitialized.current = true
        } else {
            const storedGeneratedWords = JSON.parse(window.localStorage.getItem("generatedWords"))
            const storedEasyQueue = JSON.parse(window.localStorage.getItem("easyQueue"))
            const storedHardQueue = JSON.parse(window.localStorage.getItem("hardQueue"))
            if (!storedGeneratedWords || !storedEasyQueue || !storedHardQueue) {
                initialize()
            } else {
                setGeneratedWords(storedGeneratedWords)
                setEasyQueue(storedEasyQueue)
                setHardQueue(storedHardQueue)
            }
        }
    }, [])

    return (
        <div className="ll-generate-random-container">
            <button 
                className="submit-btn ll-btn ll-generate-random-btn"
                onClick={() => getRandomWord()} 
            >
                    Generate Word
            </button>
            <GenWordErrorModal showGenWordErrorModal={showGenWordErrorModal} setShowGenWordErrorModal={setShowGenWordErrorModal} />
        </div>
    )
}

function GenWordErrorModal( {showGenWordErrorModal, setShowGenWordErrorModal} ) {
    return (
    <Modal
        show={showGenWordErrorModal}
        onHide={() => setShowGenWordErrorModal(false)}
        size='md'
        backdrop="static"
        keyboard={false}
        className="ll-modals"
        >
        <Modal.Header closeButton>
        <div className="ll-modal-header-container">
        <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
        <Modal.Title className="ll-info-modal-title">ERROR</Modal.Title>
        </div>
        </Modal.Header>
        <Modal.Body className="ll-info-modal-body">
            <p>
              An error has occured. Please wait a few seconds and try again.
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={() => setShowGenWordErrorModal(false)} className='ll-info-modal-continue-btn'>
            Continue
            </Button>
        </Modal.Footer>
    </Modal>
    )
}

export default LinguaGenerateRandom
