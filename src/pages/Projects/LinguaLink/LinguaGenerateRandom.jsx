import React from 'react'
import './LinguaGenerateRandom.css'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const NUM_WORDS_TO_GENERATE = 50
const MAX_WORD_GENERATION_GPT_RUNS = 10
const GPT_TEMPERATURE = 0.9
const GEN_WORDS_REFILL_LIMIT = 10   // limit of amount of easy or hard words stored before refilling
const GEN_WORDS_STORED_LIMIT = 80  // max amount of easy or hard words stored
const READY_GENERATED_WORDS_REFILL_LIMIT = 5 // amount of ready mnemonics left before getting more mnemonics in background
const MNEMONICS_REFILL_AMT = 6 // amount of words to get mnemonics for at a time

// // Fisher Yates shuffle algo
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }

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
            "max_tokens": 1000,
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

function LinguaGenerateRandom( {language, setIsGenerating, selectedDifficulty, setIsLoading,
                                triggerNewRandomWord, setTriggerNewRandomWord, makeGPTCall, setCurrentWord,
                            numHistoryClicks, setNumHistoryClicks, setHistory, setCurrentWordIndex, MAX_HISTORY_LENGTH} ) {
    const initialGeneratedWords = {
        easy: [], 
        hard: []
    }
    const initialGeneratedWords2 = {
        easy: [], 
        hard: []
    }
    const [generatedWords, setGeneratedWords] = React.useState(initialGeneratedWords)
    const [easyQueue, setEasyQueue] = React.useState([])
    const [hardQueue, setHardQueue] = React.useState([])
    const [newEasyQueueItems, setNewEasyQueueItems] = React.useState([])
    const [newHardQueueItems, setNewHardQueueItems] = React.useState([])
    const [newGeneratedWords, setNewGeneratedWords] = React.useState(initialGeneratedWords2)

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
        let word = {}
        console.log("generatedWords:")
        console.log(generatedWords)
        console.log("easyQueue:")
        console.log(easyQueue)
        console.log("hardQueue:")
        console.log(hardQueue)

        if (selectedDifficulty === "easy") {
            console.log("SELECTED DIFF - EASY")
            word = easyQueue[0]
            let updatedEasyQueue = easyQueue.slice(1)
            setEasyQueue(updatedEasyQueue)
            setWord(word)

            if (updatedEasyQueue.length === READY_GENERATED_WORDS_REFILL_LIMIT) {
                // refill Easy Queue
                console.log("--- REFILLING EASY QUEUE!!! ---")
                const newMnemonics = refillQueue(generatedWords, "easy")
                setNewEasyQueueItems(newMnemonics)
            }
        } else if (selectedDifficulty === "hard") {
            console.log("SELECTED DIFF - HARD")
            word = hardQueue[0]
            let updatedHardQueue = hardQueue.slice(1)
            setHardQueue(updatedHardQueue)
            setWord(word)

            if (updatedHardQueue.length === READY_GENERATED_WORDS_REFILL_LIMIT) {
                // refill Hard Queue
                console.log("--- REFILLING HARD QUEUE!!! ---")
                const newMnemonics = refillQueue(generatedWords, "hard")
                setNewHardQueueItems(newMnemonics)
            }
        }

        console.log("WORD:")
        console.log(word)
        console.log("generatedWords:")
        console.log(generatedWords)
        console.log("easyQueue:")
        console.log(easyQueue)
        console.log("hardQueue:")
        console.log(hardQueue)
        return
    }

    async function refillQueue(currentGeneratedWords, difficulty=undefined) {
        // if (currentGeneratedWords.length < MNEMONICS_REFILL_AMT) {
        //     console.log(`ERROR: generatedWords.length (${currentGeneratedWords.length}) < MNEMONICS_REFILL_AMT (${MNEMONICS_REFILL_AMT}).`)
        //     return
        // }
        let wordDifficulty = difficulty
        if (!difficulty) {
            wordDifficulty = selectedDifficulty
        }
        console.log('getting mnemonics...')
        let firstWords, newMnemonics, otherWords, updatedGeneratedWords
        console.log(`WORD DIFFICULTY: ${wordDifficulty}`)
        if (wordDifficulty === "easy") {
            console.log("HERE")
            firstWords = currentGeneratedWords.easy.slice(0, MNEMONICS_REFILL_AMT)
            newMnemonics = await Promise.all(firstWords.map(vocabWord => makeGPTCall(vocabWord, language)))
            setNewEasyQueueItems(newMnemonics)
            otherWords = currentGeneratedWords.easy.slice(MNEMONICS_REFILL_AMT)
            updatedGeneratedWords = {
                ...currentGeneratedWords,
                easy: otherWords
            }
            setGeneratedWords(updatedGeneratedWords)
        } else if (wordDifficulty === "hard") {
            console.log("SHOULD NOT BE HERE")
            firstWords = currentGeneratedWords.hard.slice(0, MNEMONICS_REFILL_AMT)
            newMnemonics = await Promise.all(firstWords.map(vocabWord => makeGPTCall(vocabWord, language)))
            setNewHardQueueItems(newMnemonics)
            otherWords = currentGeneratedWords.hard.slice(MNEMONICS_REFILL_AMT)
            updatedGeneratedWords = {
                ...currentGeneratedWords,
                hard: otherWords
            }
            setGeneratedWords(updatedGeneratedWords)
        }

        // console.log("GENERATED WORDS:")
        // console.log(updatedGeneratedWords)
        if (otherWords.length < GEN_WORDS_REFILL_LIMIT) {
            console.log("--- refilling generated words!!! ----")
            const newWordsObj = await generateRandomWordsGPT(language)
            const newWords = {
                easy: newWordsObj.beginner_vocabulary,
                hard: newWordsObj.advanced_vocabulary
            }
            // console.log("NEW WORDS:")
            // console.log(newWords)
            setNewGeneratedWords(newWords)
        } 
        return newMnemonics
    }

    React.useEffect(() => {
        if (newEasyQueueItems.length > 0) {
            const newEasyQueue = enqueue(easyQueue, newEasyQueueItems)
            setEasyQueue(newEasyQueue)
            // console.log("EASY QUEUE:")
            // console.log(newEasyQueue)
        }
    }, [newEasyQueueItems])

    React.useEffect(() => {
        if (newHardQueueItems.length > 0) {
            const newHardQueue = enqueue(hardQueue, newHardQueueItems)
            setHardQueue(newHardQueue)
            // console.log("EASY QUEUE:")
            // console.log(newEasyQueue)
        }
    }, [newHardQueueItems])

    React.useEffect(() => {
        if (newGeneratedWords.easy.length > 0 || newGeneratedWords.hard.length > 0) {
            console.log("WOAHH")
            const newEasy = enqueue(generatedWords.easy, newGeneratedWords.easy, GEN_WORDS_STORED_LIMIT)
            const newHard = enqueue(generatedWords.hard, newGeneratedWords.hard, GEN_WORDS_STORED_LIMIT)
            // TODO: shuffle words
            const updatedGeneratedWords = {
                easy: newEasy,
                hard: newHard
            }
            setGeneratedWords(updatedGeneratedWords)
            // console.log("GENERATED WORDS:")
            // console.log(updatedGeneratedWords)
        }
    }, [newGeneratedWords])

    // initialize generatedWords and mnemonicQueues on mount
    React.useEffect(() => {
        async function initialize() {
            const newWordsObj = await generateRandomWordsGPT(language)
            const newWords = {
                easy: newWordsObj.beginner_vocabulary,
                hard: newWordsObj.advanced_vocabulary
            }
            // setNewGeneratedWords(newWords)
            console.log("GENERATED WORDS:")
            console.log(newWords)
            // const newEasyMnemonics = await refillQueue(newWords, "easy")

            const firstEasyWords = newWords.easy.slice(0, MNEMONICS_REFILL_AMT)
            const easyMnemonics = await Promise.all(firstEasyWords.map(vocabWord => makeGPTCall(vocabWord, language)))
            setNewEasyQueueItems(easyMnemonics)
            const otherEasyWords = newWords.easy.slice(MNEMONICS_REFILL_AMT)

            const firstHardWords = newWords.hard.slice(0, MNEMONICS_REFILL_AMT)
            const hardMnemonics = await Promise.all(firstHardWords.map(vocabWord => makeGPTCall(vocabWord, language)))
            setNewHardQueueItems(hardMnemonics)
            const otherHardWords = newWords.hard.slice(MNEMONICS_REFILL_AMT)

            const startGeneratedWords = {
                easy: otherEasyWords,
                hard: otherHardWords
            }
            setNewGeneratedWords(startGeneratedWords)

            // updatedGeneratedWords = {
            //     ...currentGeneratedWords,
            //     easy: otherWords
            // }
            // setGeneratedWords(updatedGeneratedWords)

            // setNewEasyQueueItems(newEasyMnemonics)
            // console.log("EASY QUEUE")
            // console.log(newEasyMnemonics)
            // const newHardMnemonics = await refillQueue(newWords, "hard")
            // console.log("HARD QUEUE")
            // console.log(newHardMnemonics)
            // setNewEasyQueueItems(newEasyMnemonics)
            // setNewHardQueueItems(newHardMnemonics)
        }
        // avoid re-render (otherwise it runs this code twice)
        if (!hasInitialized.current) {
            hasInitialized.current = true
        } else {
            initialize()
        }
    }, [])

    return (
        <div className="ll-generate-random-container">
            <button 
                className="submit-btn ll-btn ll-generate-random-btn"
                onClick={() => getRandomWord(selectedDifficulty, generatedWords, setGeneratedWords, language, easyQueue)} 
            >
                    Generate Word
            </button>
        </div>
    )
}

export default LinguaGenerateRandom
