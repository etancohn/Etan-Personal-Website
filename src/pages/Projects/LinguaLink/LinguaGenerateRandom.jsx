import React from 'react'
import './LinguaGenerateRandom.css'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const NUM_WORDS_TO_GENERATE = 15
const MAX_WORD_GENERATION_GPT_RUNS = 10

const EASY_DIFFICULTY_QUEUE_MODIFICATION = "Include only basic/beginner words."
const HARD_DIFFICULTY_QUEUE_MODIFICATION = "Include only advanced/difficult words."
const MIXED_DIFFICULTY_QUEUE_MODIFICATION = "Include words of a variety of difficulty, ranging from basic to advanced."

function getDifficultyModification(selectedDifficulty) {
    if (selectedDifficulty === "easy") { return EASY_DIFFICULTY_QUEUE_MODIFICATION }
    else if (selectedDifficulty === "hard") { return HARD_DIFFICULTY_QUEUE_MODIFICATION }
    else if (selectedDifficulty === "mixed") { return MIXED_DIFFICULTY_QUEUE_MODIFICATION }
    else {
        console.log(`ERROR: Incorrect word generation difficulty input ("${selectedDifficulty}").`)
    }
}

async function generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language, setIsGenerating, 
                                      selectedDifficulty)  {
    if (numGPTRuns > MAX_WORD_GENERATION_GPT_RUNS) {
        // too many GPT runs
        console.log("ERROR: Too many invalid GPT runs")
        setIsGenerating(false)
        return
    }
    const difficultyModification = getDifficultyModification(selectedDifficulty)
    // Query string for the API request
    // const query = ` 
    // Give me a list of ${NUM_WORDS_TO_GENERATE} ${language} common vocabulary words. ${getDifficultyModification(selectedDifficulty)} Only 
    // include the word or phrase, without a definition or anything else.
    
    // <| endofprompt |>
    // \n
    // Word 0: 
    //     `;
    let query = import.meta.env.VITE_GENERATE_RANDOM_QUERY
    query = query.replace("--{NUM_WORDS_TO_GENERATE}--", NUM_WORDS_TO_GENERATE)
    query = query.replace("--{language}--", language)
    query = query.replace("--{difficultyModification}--", difficultyModification)
    console.log(query)

    // Options for the API request
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: query }],
            max_tokens: 1024
        })
    };

    try {
        // Sending the API request and getting the response
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        
        // Updating the output text with the received response
        const outputText = data.choices[0].message.content
        console.log(`outputText: ${outputText}`)
        await parseRandomWordsGPTOutput(outputText, setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language, setIsGenerating,
                                        selectedDifficulty)
        return
    } catch(error) {
        console.error(error);
    }
}

async function parseRandomWordsGPTOutput(outputText, setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language, setIsGenerating,
                                         selectedDifficulty) {
    const randomWordsRegex = /\bWord \d+: /i
    let wordsArray = outputText.split(randomWordsRegex);
    wordsArray = wordsArray.map((vocabWord) => vocabWord.trim())

    // test whether the output came out in the correct format. Re-run GPT if invalid
    const generatedWordsInvalid = (wordsArray.length !== NUM_WORDS_TO_GENERATE || wordsArray.includes(""))
    if (generatedWordsInvalid) {
        console.log(`ERROR: Generated words in invalid format. Re-run GPT ${numGPTRuns}`)
        setNumGPTRuns(numGPTRuns+1)
        await generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns+1, setNumGPTRuns, language, setIsGenerating,
                                     selectedDifficulty)
        return
    }
    // valid output
    console.log(`wordsArray: ${wordsArray}`)
    setGeneratedWordsArr(wordsArray)
    setNumGPTRuns(0)
    setIsGenerating(false)
    return
}

async function getRandomWord(generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord, numGPTRuns, setNumGPTRuns, language,
                             setIsGenerating, selectedDifficulty, setIsLoading) {
    console.log(`getting random word. generatedWordsArr: ${generatedWordsArr}`)
    setIsLoading(true)
    if (generatedWordsArr.length === 0) {
        setIsGenerating(true)
        await generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language, setIsGenerating, selectedDifficulty)
    }
    setTriggerNewRandomWord(true)
    return
}

function LinguaGenerateRandom( {setGeneratedWord, language, setIsGenerating, selectedDifficulty, setIsLoading,
                                triggerNewRandomWord, setTriggerNewRandomWord} ) {
    const [generatedWordsArr, setGeneratedWordsArr] = React.useState([])
    const [numGPTRuns, setNumGPTRuns] = React.useState(0)

    React.useEffect(() => {
        if (!triggerNewRandomWord) { return }
        setTriggerNewRandomWord(false)
        if (generatedWordsArr.length === 0) { 
            getRandomWord(generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord, numGPTRuns, setNumGPTRuns, language,
                          setIsGenerating, selectedDifficulty, setIsLoading)
            return 
        }

        const firstWord = generatedWordsArr[0]
        setGeneratedWordsArr(generatedWordsArr.slice(1, generatedWordsArr.length))
        setGeneratedWord(firstWord)
    }, [triggerNewRandomWord])

    // call GPT for a new list of words next time if the user switches the language or difficulty options
    React.useMemo(() => {
        setGeneratedWordsArr([])
    }, [language, selectedDifficulty])

    return (
        <div className="ll-generate-random-container">
            <button 
                className="submit-btn ll-btn ll-generate-random-btn"
                onClick={() => getRandomWord(generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord, numGPTRuns, 
                                             setNumGPTRuns, language, setIsGenerating, selectedDifficulty, setIsLoading)} >
                    Generate Word
            </button>
        </div>
    )
}

export default LinguaGenerateRandom
