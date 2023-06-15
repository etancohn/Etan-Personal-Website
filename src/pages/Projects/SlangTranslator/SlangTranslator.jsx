import React from 'react'
import './SlangTranslator.css'
import GreenNavbar from '../../../components/GreenNavbar'
import Footer from '../../../components/Footer'
import OutputBox from '../../../components/OutputBox'
import '../../../global.css'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

async function makeQuery(slangInput, setOutputText, setOutputValidationStr) {
    // Query string for the API request
    const query = `
    Translate my slang. Give just the translation itself. Make the translation sound like you are an intellectual.

    input: ${slangInput}
    `

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
        max_tokens: 100
        })
    }

    try {
        // Sending the API request and getting the response
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        
        // Updating the output text with the received response
        setOutputText(data.choices[0].message.content);
        setOutputValidationStr(`'${slangInput}':`)
    } catch(error) {
        console.error(error);
    }
}

function SlangTranslator() {
    const [slangInput, setSlangInput] = React.useState("")
    const [outputText, setOutputText] = React.useState("Drop that slang above, fam! It'll be lit.")
    const [outputValidationStr, setOutputValidationStr] = React.useState("")
    const [slangInputFocussed, setSlangInputFocussed] = React.useState(false);

    const slangInputRef = React.useRef(null)

    const handleKeyPressed = (e) => {
        // if enter is pushed, either change focus to second input or make API call
        if (e.key === 'Enter') {
          if (!slangInputFocussed) {   
            slangInputRef.current.focus()
          } else {
            makeQuery(slangInput, setOutputText, setOutputValidationStr)
          }
        }
    }

    // Add event listener to check if a key is pressed
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyPressed)

        return () => {
        // cleanup
        document.removeEventListener('keydown', handleKeyPressed)
        }
    }, [slangInput])

    return ( 
        <>
        <div className="slang-translator">
            <GreenNavbar />

            <div className="slang-translator-content-container">

            <h1 className="project-title">Slang Translator</h1>
            <p className="project-description">
                Enter a slang phrase, and we will give you a translation.
            </p>

            <div className="slang-translator-example-inputs">
                <h4>Example inputs:</h4>
                <ul className="slang-translator-example-items">
                    <li>"Bruh, that's cringe. I can't even"</li>
                    <li>"omg slay!! Pop off bestie queeeennn"</li>
                    <li>"Yooooo that's fire. Based af, my dudes"</li>
                    <li>"F in the chat"</li>
                </ul>
            </div>

            <div className="slang-translator-input-container">
                <h4 className="project-mini-title">Slang Input:</h4>
                <input 
                    type="text" 
                    className="slang-translator-input-box"
                    placeholder="ex: omg slay!! Pop off bestie queen" 
                    value={slangInput}
                    ref={slangInputRef}
                    onFocus={() => setSlangInputFocussed(true)}
                    onBlur={() => setSlangInputFocussed(false)}
                    onChange={(e) => setSlangInput(e.target.value)}>
                </input>

            </div>

            <button 
                className="slang-translator-submit-btn"
                onClick={() => makeQuery(slangInput, setOutputText, setOutputValidationStr)}>
                    Submit
            </button>

            <div className="slang-translator-output-container">
                <OutputBox 
                    titleText={"input: " + `${outputValidationStr}`}
                    outputText={outputText} />
            </div>

            </div>

        </div>

        <Footer />
        </>
    )
}

export default SlangTranslator
