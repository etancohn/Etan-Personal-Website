import React from 'react'
import './LinguaGenerateRandom.css'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const NUM_WORDS_TO_GENERATE = 5
const MAX_WORD_GENERATION_GPT_RUNS = 10
const GPT_TEMPERATURE = 1

// const EASY_DIFFICULTY_QUEUE_MODIFICATION = "Include only basic/beginner words."
// const HARD_DIFFICULTY_QUEUE_MODIFICATION = "Include only intermediate and advanced/difficult words."
// const MIXED_DIFFICULTY_QUEUE_MODIFICATION = "Include words of a variety of difficulty, ranging from basic to advanced."

// function getDifficultyModification(selectedDifficulty) {
//     if (selectedDifficulty === "easy") { return EASY_DIFFICULTY_QUEUE_MODIFICATION }
//     else if (selectedDifficulty === "hard") { return HARD_DIFFICULTY_QUEUE_MODIFICATION }
//     else if (selectedDifficulty === "mixed") { return MIXED_DIFFICULTY_QUEUE_MODIFICATION }
//     else {
//         console.log(`ERROR: Incorrect word generation difficulty input ("${selectedDifficulty}").`)
//     }
// }

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
        console.log(outputObj)
        return outputObj
    } catch(error) {
        console.error(error)
    }
}

// async function generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language, setIsGenerating, 
//                                       selectedDifficulty)  {
//     if (numGPTRuns > MAX_WORD_GENERATION_GPT_RUNS) {
//         // too many GPT runs
//         console.log("ERROR: Too many invalid GPT runs")
//         setIsGenerating(false)
//         setNumGPTRuns(0)
//         return
//     }
//     const difficultyModification = getDifficultyModification(selectedDifficulty)
//     // Query string for the API request
//     let query = import.meta.env.VITE_GENERATE_RANDOM_QUERY
//     query = query.replace("--{NUM_WORDS_TO_GENERATE}--", NUM_WORDS_TO_GENERATE)
//     query = query.replace("--{language}--", language)
//     query = query.replace("--{difficultyModification}--", difficultyModification)
//     if (language === "Chinese") {
//         query = query.replace("else.", "else. Include pinyin in parentheses.")
//     }

//     // Options for the API request
//     const options = {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${API_KEY}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "user", content: query }],
//             max_tokens: 1024,
//             temperature: GPT_TEMPERATURE
//         })
//     };

//     try {
//         // Sending the API request and getting the response
//         const response = await fetch('https://api.openai.com/v1/chat/completions', options);
//         const data = await response.json();
        
//         // Updating the output text with the received response
//         const outputText = data.choices[0].message.content
//         console.log(`outputText: ${outputText}`)
//         await parseRandomWordsGPTOutput(outputText, setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language, setIsGenerating,
//                                         selectedDifficulty)
//         return
//     } catch(error) {
//         console.error(error);
//     }
// }

// async function parseRandomWordsGPTOutput(outputText, setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language, setIsGenerating,
//                                          selectedDifficulty) {
//     const randomWordsRegex = /\bWord \d+: /i
//     let wordsArray = outputText.split(randomWordsRegex);
//     wordsArray = wordsArray.map((vocabWord) => vocabWord.trim())

//     // test whether the output came out in the correct format. Re-run GPT if invalid
//     let generatedWordsInvalid = (wordsArray.length !== NUM_WORDS_TO_GENERATE || wordsArray.includes(""))
//     if (language === "Chinese") {
//         // make sure pinyin is included!
//         const hasPinyin = /^[^\s]+\s\(.+\)$/
//         const allPinyin = wordsArray.every((s) => hasPinyin.test(s))
//         generatedWordsInvalid = (generatedWordsInvalid || (!allPinyin))
//     }
//     if (generatedWordsInvalid) {
//         console.log(`ERROR: Generated words in invalid format. Re-run GPT ${numGPTRuns}`)
//         setNumGPTRuns(numGPTRuns+1)
//         await generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns+1, setNumGPTRuns, language, setIsGenerating,
//                                      selectedDifficulty)
//         return
//     }
//     // valid output
//     console.log(`wordsArray: ${wordsArray}`)
//     setGeneratedWordsArr(shuffleArray(wordsArray))
//     setNumGPTRuns(0)
//     setIsGenerating(false)
//     return
// }

// async function getRandomWord(generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord, numGPTRuns, setNumGPTRuns, language,
//                              setIsGenerating, selectedDifficulty, setIsLoading) {
//     console.log(`getting random word. generatedWordsArr: ${generatedWordsArr}`)
//     setIsLoading(true)
//     if (generatedWordsArr.length === 0) {
//         setIsGenerating(true)
//         await generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language, setIsGenerating, selectedDifficulty)
//     }
//     setTriggerNewRandomWord(true)
//     return
// }

function getRandomWord(selectedDifficulty, generatedWords, setGeneratedWords, language, makeGPTCall) {
    // const firstWord, restOfWords
    // const firstWord = generatedWordsArr[0]
    // setGeneratedWordsArr(generatedWordsArr.slice(1, generatedWordsArr.length))
    let firstWord, restOfWordsArr
    if (selectedDifficulty === "easy") {
        const wordsArr = generatedWords.easy
        firstWord = wordsArr[0]
        restOfWordsArr = wordsArr.slice(1, wordsArr.length)
        setGeneratedWords({
            easy: restOfWordsArr,
            hard: generatedWords.hard
        })
    } else if (selectedDifficulty === "hard") {
        const wordsArr = generatedWords.hard
        firstWord = wordsArr[0]
        restOfWordsArr = wordsArr.slice(1, wordsArr.length)
        setGeneratedWords({
            easy: generatedWords.easy,
            hard: restOfWordsArr
        })
    } else {
        console.log(`ERROR: selectedDifficulty is not set to 'easy' or 'hard': ('${selectedDifficulty}')`)
    }
    console.log(firstWord)
    console.log(restOfWordsArr)
    if (restOfWordsArr.length === 0) {
        resetGenerated(language, setGeneratedWords, makeGPTCall)
    }
}

async function resetGenerated(language, setGeneratedWords, makeGPTCall) {
    const generated = generateRandomWordsGPT(language)
    generated.then((result) => {
        setGeneratedWords({
        easy: result.beginner_vocabulary,
        hard: result.advanced_vocabulary
        })
        Promise.all([
            makeGPTCall(result.beginner_vocabulary[0]),
            makeGPTCall(result.beginner_vocabulary[1]),
            makeGPTCall(result.beginner_vocabulary[2]),
            makeGPTCall(result.beginner_vocabulary[3]),
            makeGPTCall(result.beginner_vocabulary[4])
        ])
        .then((results) => {
            results.map((val, index) => {
                console.log(val)
            })
            // console.log(results)
        })
        // makeGPTCall(firstWord, language)
        // .then((outputObj) => {
        //     console.log(outputObj)
        // })
    })
}

function LinguaGenerateRandom( {language, setIsGenerating, selectedDifficulty, setIsLoading,
                                triggerNewRandomWord, setTriggerNewRandomWord, makeGPTCall} ) {
    // const [generatedWordsArr, setGeneratedWordsArr] = React.useState([])
    // const [numGPTRuns, setNumGPTRuns] = React.useState(0)
    const [generatedWords, setGeneratedWords] = React.useState({easy: [], hard: []})

    React.useEffect(() => {
        resetGenerated(language, setGeneratedWords, makeGPTCall)
    }, [])

    // React.useEffect(() => {
    //     if (!triggerNewRandomWord) { return }
    //     setTriggerNewRandomWord(false)
    //     if (generatedWordsArr.length === 0) { 
    //         getRandomWord(generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord, numGPTRuns, setNumGPTRuns, language,
    //                       setIsGenerating, selectedDifficulty, setIsLoading)
    //         return 
    //     }

    //     const firstWord = generatedWordsArr[0]
    //     setGeneratedWordsArr(generatedWordsArr.slice(1, generatedWordsArr.length))
    //     setGeneratedWord(firstWord)
    // }, [triggerNewRandomWord])

    // call GPT for a new list of words next time if the user switches the language, changes difficulty options,
    // or 
    // React.useMemo(() => {
    //     setGeneratedWordsArr([])
    // }, [language, selectedDifficulty])

    // React.useEffect(() => {
    //     if (generatedWords.easy.length === 0 || generatedWords.hard.length === 0) {
    //         resetGenerated(language, setGeneratedWords)
    //     }
    // }, [generatedWords])

    return (
        <div className="ll-generate-random-container">
            <button 
                className="submit-btn ll-btn ll-generate-random-btn"
                onClick={() => getRandomWord(selectedDifficulty, generatedWords, setGeneratedWords, language, makeGPTCall)} 
                // onClick={() => getRandomWord(generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord, numGPTRuns, 
                //                              setNumGPTRuns, language, setIsGenerating, selectedDifficulty, setIsLoading)} 
            >
                    Generate Word
            </button>
        </div>
    )
}

export default LinguaGenerateRandom
