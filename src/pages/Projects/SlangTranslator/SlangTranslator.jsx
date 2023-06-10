import React from 'react'
import './SlangTranslator.css'
import GreenNavbar from '../../../components/GreenNavbar'

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
    const [outputText, setOutputText] = React.useState("")
    const [outputValidationStr, setOutputValidationStr] = React.useState("")
    return (
        <div className="slang-translator">
            <GreenNavbar />
            <h1 className="title">Slang Translator</h1>
            <p className="description">
                Enter a slang phrase, and we will give you back an intellectual sounding translation.
            </p>
            <input 
                type="text" 
                className="input-box"
                placeholder="ex: omg slay!! Pop off bestie queen" 
                value={slangInput}
                onChange={(e) => setSlangInput(e.target.value)}>
            </input>

            <button 
                className="slang-translator-submit-btn"
                onClick={() => makeQuery(slangInput, setOutputText, setOutputValidationStr)}>
                    Submit
            </button>

            <div className="slang-translator-output">
                <span className="output-title">{outputValidationStr !== "" && `${outputValidationStr}`}</span>
                <span className="no-output-title">{outputValidationStr === "" && "Drop that slang above, fam! It'll be lit, my dude"}</span>
                <p className="output-text">{outputText}</p>
            </div>

        </div>
    )
}

export default SlangTranslator
