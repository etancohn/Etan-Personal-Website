import React from 'react'
import logo1 from './pics/logo_1.png'
import logo2 from './pics/logo_2.png'
import logo3 from './pics/logo_3.png'
import logo4 from './pics/logo_4.png'
import logo5 from './pics/logo_5.png'
import './MainTool.css'
import LinguaSingleOutput from './LinguaSingleOutput'
import ToolTabs from './ToolTabs'



// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// changeable constants
const MAX_GPT_RUNS = 10
const MAX_HISTORY_LENGTH = 40
const TEXT_GENERATION_SLOWNESS = 4
const GPT_TEMPERATURE = 0.5

async function makeGPTCall(vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, 
                          setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex,
                          language) {
    // max re-runs of GPT hit
    if (numGPTRuns+1 > MAX_GPT_RUNS) { 
        setIsLoading(false)
        const newCurrent = {
            word: vocabWord,
            translation: "An error has occurred. Please try submitting again.",
            association: " ",
            mentalImage: " ",
            explanation: " ",
            outputText: " ",
            url: "",
            language: ""
        }
        setCurrentWord(newCurrent)
        setNumGPTRuns(0)
        return
    }
    setIsLoading(true)
    // Query string for the API request
    let query = import.meta.env.VITE_MAIN_TOOL_QUERY
    query = query.replace("--{language}--", language)
    query = query.replace("--{vocabWord}--", vocabWord.trim())

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
            max_tokens: 1024,
            temperature: GPT_TEMPERATURE
        })
    };

    try {
        // Sending the API request and getting the response
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        
        // Updating the output text with the received response
        const outputText = data.choices[0].message.content
        await parseGPTOutput(outputText, setCurrentWord, vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, 
                      setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language)
      } catch(error) {
        console.error(error);
      }
}

async function parseGPTOutput(outputText, setCurrentWord, word, setIsLoading, numGPTRuns, setNumGPTRuns, 
                        setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex, language) {
    console.log(outputText)
    if (word === "") { return }

    const translationRegex = /Translation:\s+(.+)/i;
    const associationRegex = /Mnemonic:\s+(.+)/i;
    // const associationRegex = /Association:\s+(.+)/i;
    const mentalImageRegex = /Mental Image:\s+(.+)/i;
    const explanationRegex = /Explanation:\s+(.+)/i;
    
    const translationMatch = outputText.match(translationRegex);
    const associationMatch = outputText.match(associationRegex);
    const mentalImageMatch = outputText.match(mentalImageRegex);
    const explanationMatch = outputText.match(explanationRegex);
    
    const translation = translationMatch ? translationMatch[1] : '';
    const association = associationMatch ? associationMatch[1] : '';
    const mentalImage = mentalImageMatch ? mentalImageMatch[1] : '';
    const explanation = explanationMatch ? explanationMatch[1] : '';

    const llOutputInvalid = (translation === '' || association === '' 
                        || mentalImage === '' || explanation === '')

    if (llOutputInvalid) {
        await setNumGPTRuns(numGPTRuns+1)
        console.log(`INVALID - RERUN ("${word}") (${numGPTRuns+1})`)
        await makeGPTCall(word, setIsLoading, numGPTRuns+1, setNumGPTRuns, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
                    setHistory, setCurrentWordIndex, language)
        return
    } 

    setNumGPTRuns(0)
    // Now you can use the extracted values as needed
    const newCurrent = {
        word: word,
        translation: translation,
        association: association,
        mentalImage: mentalImage,
        explanation: explanation,
        outputText: outputText,
        url: "",
        hasImage: false,
        language: language
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
                       setTriggerGeneration5, setTriggerBlank) {
    setTriggerGeneration1(false)
    setTriggerGeneration2(false)
    setTriggerGeneration3(false)
    setTriggerGeneration4(false)
    setTriggerGeneration5(false)
    setTriggerBlank(false)
}

function MainTool( {currentWord, setCurrentWord, numHistoryClicks, setHistory, setCurrentWordIndex,
                    language, setIsGenerating} ) {
    const [vocabWord, setVocabWord] = React.useState("")
    const vocabWordInputRef = React.useRef(null);
    const [numGPTRuns, setNumGPTRuns] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)
    const [triggerGeneration1, setTriggerGeneration1] = React.useState(false)
    const [triggerGeneration2, setTriggerGeneration2] = React.useState(false)
    const [triggerGeneration3, setTriggerGeneration3] = React.useState(false)
    const [triggerGeneration4, setTriggerGeneration4] = React.useState(false)
    const [triggerGeneration5, setTriggerGeneration5] = React.useState(false)
    const [triggerBlank, setTriggerBlank] = React.useState(false)
    const [generatedWord, setGeneratedWord] = React.useState("")

    React.useEffect(() => {
        setVocabWord(currentWord.word)
        setIsLoading(false)
    }, [currentWord])

    React.useEffect(() => {
        if (generatedWord.trim() === "") { return }
        makeGPTCall(generatedWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
            setHistory, setCurrentWordIndex, language)
    }, [generatedWord])

    return (
        <div className="main-tool">
            <ToolTabs vocabWord={vocabWord} vocabWordInputRef={vocabWordInputRef} makeGPTCall={makeGPTCall}
                      setVocabWord={setVocabWord} setIsLoading={setIsLoading} numGPTRuns={numGPTRuns} setNumGPTRuns={setNumGPTRuns} 
                      setTriggerGeneration1={setTriggerGeneration1} setTriggerBlank={setTriggerBlank} setHistory={setHistory} 
                      setCurrentWordIndex={setCurrentWordIndex} language={language} setGeneratedWord={setGeneratedWord} 
                      setIsGenerating={setIsGenerating} setCurrentWord={setCurrentWord}/>

            {/* output boxes */} 
            <div className={`ll-output-box-container ll-output-is-loading-${isLoading}`}>
                <LinguaSingleOutput logo={logo1} title="YOUR WORD" text={currentWord.word} 
                                    num="1" triggerGeneration={triggerGeneration1}
                                    onCompletion={() => setTriggerGeneration2(true) } triggerBlank={triggerBlank} 
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS}
                                    language={language} currentWord={currentWord} />
                <LinguaSingleOutput logo={logo2} title="TRANSLATION" text={currentWord.translation} 
                                    num="2" triggerGeneration={triggerGeneration2}
                                    onCompletion={() => setTriggerGeneration3(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS}
                                    language={language} currentWord={currentWord} />
                <LinguaSingleOutput logo={logo3} title="MNEMONIC" text={currentWord.association} 
                                    num="3" triggerGeneration={triggerGeneration3}
                                    onCompletion={() => setTriggerGeneration4(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS}
                                    language={language} currentWord={currentWord} />
                <LinguaSingleOutput logo={logo4} title="MENTAL IMAGE" text={currentWord.mentalImage} 
                                    num="4" triggerGeneration={triggerGeneration4} 
                                    onCompletion={() => setTriggerGeneration5(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS}
                                    language={language} currentWord={currentWord} />
                <LinguaSingleOutput logo={logo5} title="EXPLANATION" text={currentWord.explanation} 
                                    num="5" triggerGeneration={triggerGeneration5}
                                    onCompletion={() => resetTriggers(setTriggerGeneration1, setTriggerGeneration2, setTriggerGeneration3,
                                                        setTriggerGeneration4, setTriggerGeneration5, setTriggerBlank)} 
                                    triggerBlank={triggerBlank} numHistoryClicks={numHistoryClicks} 
                                    TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS} language={language} currentWord={currentWord} />
            </div>  
        </div>
    )
}

export default MainTool
