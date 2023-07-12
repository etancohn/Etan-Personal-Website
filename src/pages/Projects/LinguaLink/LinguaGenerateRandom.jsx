import React from 'react'
import './LinguaGenerateRandom.css'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const NUM_WORDS_TO_GENERATE = 10
const MAX_WORD_GENERATION_GPT_RUNS = 10


async function generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language)  {
    if (numGPTRuns > MAX_WORD_GENERATION_GPT_RUNS) {
        // too many GPT runs
        console.log("ERROR: Too many invalid GPT runs")
        return
    }
    // Query string for the API request
    const query = ` 
    Give me a list of ${NUM_WORDS_TO_GENERATE} ${language} vocabulary words of varying difficulty. Don't include too many
    beginner words. Only include the word or phrase, without a definition or anything else.
    
    <| endofprompt |>
    \n
    Word 0: 
        `;

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
        await parseRandomWordsGPTOutput(outputText, setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language)
        return
    } catch(error) {
        console.error(error);
    }
}

async function parseRandomWordsGPTOutput(outputText, setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language) {
    const randomWordsRegex = /\bWord \d+: /i
    let wordsArray = outputText.split(randomWordsRegex);
    wordsArray = wordsArray.map((vocabWord) => vocabWord.trim())

    // test whether the output came out in the correct format. Re-run GPT if invalid
    const generatedWordsInvalid = (wordsArray.length !== NUM_WORDS_TO_GENERATE || wordsArray.includes(""))
    if (generatedWordsInvalid) {
        console.log(`ERROR: Generated words in invalid format. Re-run GPT ${numGPTRuns}`)
        setNumGPTRuns(numGPTRuns+1)
        await generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns+1, setNumGPTRuns, language)
        return
    }
    // valid output
    console.log(`wordsArray: ${wordsArray}`)
    setGeneratedWordsArr(wordsArray)
    setNumGPTRuns(0)
    return
}

async function getRandomWord(generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord, numGPTRuns, setNumGPTRuns, language) {
    console.log(`getting random word. generatedWordsArr: ${generatedWordsArr}`)
    if (generatedWordsArr.length === 0) {
        await generateRandomWordsGPT(setGeneratedWordsArr, numGPTRuns, setNumGPTRuns, language)
    }
    setTriggerNewRandomWord(true)
    return
}

function LinguaGenerateRandom( {setGeneratedWord, language} ) {
    const [generatedWordsArr, setGeneratedWordsArr] = React.useState([])
    const [triggerNewRandomWord, setTriggerNewRandomWord] = React.useState(false)
    const [numGPTRuns, setNumGPTRuns] = React.useState(0)

    React.useEffect(() => {
        if (!triggerNewRandomWord) { return }
        setTriggerNewRandomWord(false)
        if (generatedWordsArr.length === 0) { return }

        const firstWord = generatedWordsArr[0]
        setGeneratedWordsArr(generatedWordsArr.slice(1, generatedWordsArr.length))
        setGeneratedWord(firstWord)
    }, [triggerNewRandomWord])

    React.useMemo(() => {
        setGeneratedWordsArr([])
    }, [language])

    return (
        <div className="ll-generate-random-container">
            <button 
                className="submit-btn ll-btn ll-generate-random-btn"
                onClick={() => getRandomWord(generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord, numGPTRuns, 
                                             setNumGPTRuns, language)} >
                    Generate Word
            </button>
        </div>
    )
}

export default LinguaGenerateRandom
