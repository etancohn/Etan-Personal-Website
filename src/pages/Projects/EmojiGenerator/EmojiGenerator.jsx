import React from 'react'
import './EmojiGenerator.css'
import GreenNavbar from '../../../components/GreenNavbar'
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Footer from '../../../components/Footer';

// settings for emoji count
const EMOJIS_LOW = "2"
const EMOJIS_MEDIUM = "7"
const EMOJIS_HIGH = "20"

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

async function makeEmojiQuery(emojiInput, numOfEmojis, setOutputText, setOutputValidationStr) {
    // Query string for the API request
    const query = `Respond with ${numOfEmojis} emojis representing the input query. example:

    input: smile

    😄😃😊🙂🤗

    input: ${emojiInput}
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
        setOutputValidationStr(`'${emojiInput}':`)
    } catch(error) {
        console.error(error);
    }
}

function EmojiGenerator() {
    const [emojiInput, setEmojiInput] = React.useState("")
    const [numOfEmojis, setNumOfEmojis] = React.useState(EMOJIS_MEDIUM)
    const [outputText, setOutputText] = React.useState("")
    const [outputValidationStr, setOutputValidationStr] = React.useState("")

    return (
        <>
            <GreenNavbar />
            <div className='emoji-generator'>
                <h1 className="emoji-generator-title">😎 Emoji Generator 🤗</h1>
                <p className="emoji-generator-description">
                    Enter a phrase to get an emoji representation.
                </p>

                <input 
                    type="text" 
                    className="input-box"
                    placeholder="ex: New York City" 
                    value={emojiInput}
                    onChange={(e) => setEmojiInput(e.target.value)}>
                </input>

                <button 
                    className="emoji-generator-submit-btn"
                    onClick={() => makeEmojiQuery(emojiInput, numOfEmojis, setOutputText, setOutputValidationStr)}>
                        Submit
                </button>

                <div className="emoji-generator-output">
                    <span className="emoji-generator-output-title">{outputValidationStr !== "" && `${outputValidationStr}`}</span>
                    <span className="emoji-generator-no-output-title">{outputValidationStr === "" && "Enter a phrase above."}</span>
                    <p className="emoji-generator-output-text">{outputText}</p>
                </div>

                <h4>Emoji Count:</h4>

                <ToggleButtonGroup type="radio" name="options" defaultValue={2} size="lg" >
                    <ToggleButton className={numOfEmojis === EMOJIS_LOW ? "checked-btn" : ""} 
                        id="tbg-radio-1" 
                        onClick={() => setNumOfEmojis(EMOJIS_LOW)} 
                        value={1}>
                        Low
                    </ToggleButton>
                    <ToggleButton 
                        id="tbg-radio-2" 
                        className={numOfEmojis === EMOJIS_MEDIUM ? "checked-btn" : ""} 
                        onClick={() => setNumOfEmojis(EMOJIS_MEDIUM)} 
                        value={2}>
                        Medium
                    </ToggleButton>
                    <ToggleButton 
                        id="tbg-radio-3" 
                        className={numOfEmojis === EMOJIS_HIGH ? "checked-btn" : ""} 
                        onClick={() => setNumOfEmojis(EMOJIS_HIGH)} 
                        value={3}>
                        High
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Footer />
        </>
    )
}

export default EmojiGenerator
