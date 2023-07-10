import React from 'react'
import logo1 from '../../../pics/LinguaLink/logo_1.png'
import logo2 from '../../../pics/LinguaLink/logo_2.png'
import logo3 from '../../../pics/LinguaLink/logo_3.png'
import logo4 from '../../../pics/LinguaLink/logo_4.png'
import logo5 from '../../../pics/LinguaLink/logo_5.png'
import './MainTool.css'
import LinguaSingleOutput from './LinguaSingleOutput'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// changeable constants
const MAX_GPT_RUNS = 10
const MAX_HISTORY_LENGTH = 60
const TEXT_GENERATION_SLOWNESS = 1

async function makeGPTCall(vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, 
                          setTriggerGeneration1, setTriggerBlank, setHistory) {
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
            url: ""
        }
        setCurrentWord(newCurrent)
        setNumGPTRuns(0)
        return
    }
    setIsLoading(true)
    setNumGPTRuns(numGPTRuns+1)
    // Query string for the API request
    const query = `
        I will give you a vocab word. Use psychology memory techniques to give me back a word/memory
        association to remember the Spanish vocab word. Use the Linkword Mnemonic technique for an
        association. Make a mental image that matches the association, utilizing elaborative encoding
        techniques. Give the answer in the form of <word>\n\n<translation>\n\n<association>\n\n<mental
        image>\n\n<explanation>.
        \n
        <| endofprompt |>
        \n
        Word: ${vocabWord}
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
        parseGPTOutput(outputText, setCurrentWord, vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, 
                      setTriggerGeneration1, setTriggerBlank, setHistory)
      } catch(error) {
        console.error(error);
      }
}

function parseGPTOutput(outputText, setCurrentWord, word, setIsLoading, numGPTRuns, setNumGPTRuns, 
                        setTriggerGeneration1, setTriggerBlank, setHistory) {
    console.log(outputText)
    if (word === "") { return }

    const translationRegex = /Translation:\s+(.+)/i;
    const associationRegex = /Association:\s+(.+)/i;
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
        console.log(`INVALID - RERUN ("${word}") (${numGPTRuns})`)
        makeGPTCall(word, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
                    setHistory)
        return
    } else {
        setNumGPTRuns(0)
    }
    
    // Now you can use the extracted values as needed
    const newCurrent = {
        word: word,
        translation: translation,
        association: association,
        mentalImage: mentalImage,
        explanation: explanation,
        outputText: outputText,
        url: ""
    }
    setHistory(prevHistory => {
        let updatedHistory = [...prevHistory, newCurrent]
        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
            updatedHistory = updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH, updatedHistory.length)
        }
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

function MainTool( {currentWord, setCurrentWord, numHistoryClicks, setHistory} ) {
    const [vocabWord, setVocabWord] = React.useState("")
    const [vocabWordInputFocussed, setVocabWordInputFocussed] = React.useState(false);
    const vocabWordInputRef = React.useRef(null);
    const [numGPTRuns, setNumGPTRuns] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)
    const [triggerGeneration1, setTriggerGeneration1] = React.useState(false)
    const [triggerGeneration2, setTriggerGeneration2] = React.useState(false)
    const [triggerGeneration3, setTriggerGeneration3] = React.useState(false)
    const [triggerGeneration4, setTriggerGeneration4] = React.useState(false)
    const [triggerGeneration5, setTriggerGeneration5] = React.useState(false)
    const [triggerBlank, setTriggerBlank] = React.useState(false)

    React.useEffect(() => {
        setVocabWord(currentWord.word)
        setIsLoading(false)
        console.log(currentWord)
    }, [currentWord])

    // handle user pushing 'Enter'
    const handleKeyPressed = (e) => {
        // if enter is pushed, either change focus to vocab word input or make API call
        if (e.key === 'Enter') {
        if (vocabWordInputFocussed) {   
            makeGPTCall(vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, setTriggerGeneration1, setTriggerBlank,
                        setHistory)
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
        <div className="main-tool">

            {/* input box */}
            <div className="vocab-input-container">
                <h4 className="project-mini-title ll-title">VOCAB WORD</h4>
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
                    className="submit-btn ll-btn"
                    onClick={() => makeGPTCall(vocabWord, setIsLoading, numGPTRuns, setNumGPTRuns, setCurrentWord, 
                                               setTriggerGeneration1, setTriggerBlank, setHistory)}>
                        Submit
                </button>
            </div>

            {/* output boxes */}
            <div className={`ll-output-box-container ll-output-is-loading-${isLoading}`}>
                <LinguaSingleOutput logo={logo1} title="YOUR WORD" text={currentWord.word} 
                                    isEven={true} num="1" triggerGeneration={triggerGeneration1}
                                    onCompletion={() => setTriggerGeneration2(true) } triggerBlank={triggerBlank} 
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS} />
                <LinguaSingleOutput logo={logo2} title="TRANSLATION" text={currentWord.translation} 
                                    num="2" triggerGeneration={triggerGeneration2}
                                    onCompletion={() => setTriggerGeneration3(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS} />
                <LinguaSingleOutput logo={logo3} title="ASSOCIATION" text={currentWord.association} 
                                    isEven={true} num="3" triggerGeneration={triggerGeneration3}
                                    onCompletion={() => setTriggerGeneration4(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS} />
                <LinguaSingleOutput logo={logo4} title="MENTAL IMAGE" text={currentWord.mentalImage} 
                                    num="4" triggerGeneration={triggerGeneration4} 
                                    onCompletion={() => setTriggerGeneration5(true)} triggerBlank={triggerBlank}
                                    numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS} />
                <LinguaSingleOutput logo={logo5} title="EXPLANATION" text={currentWord.explanation} 
                                    isEven={true} num="5" triggerGeneration={triggerGeneration5}
                                    onCompletion={() => resetTriggers(setTriggerGeneration1, setTriggerGeneration2, setTriggerGeneration3,
                                                        setTriggerGeneration4, setTriggerGeneration5, setTriggerBlank)} triggerBlank={triggerBlank} 
                                                        numHistoryClicks={numHistoryClicks} TEXT_GENERATION_SLOWNESS={TEXT_GENERATION_SLOWNESS} />
            </div>  
        </div>
    )
}

export default MainTool
