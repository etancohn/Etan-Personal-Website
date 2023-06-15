import React from 'react'
import './EmojiGenerator.css'
import GreenNavbar from '../../../components/GreenNavbar'
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Footer from '../../../components/Footer';
import OutputBox from '../../../components/OutputBox';

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
    const [outputText, setOutputText] = React.useState("Enter a phrase above.")
    const [outputValidationStr, setOutputValidationStr] = React.useState("")
    const [emojiInputFocussed, setEmojiInputFocussed] = React.useState(false);

    const emojiInputRef = React.useRef(null)

    const handleKeyPressed = (e) => {
        // if enter is pushed, either change focus to second input or make API call
        if (e.key === 'Enter') {
          if (!emojiInputFocussed) {   
            emojiInputRef.current.focus()
          } else {
            makeEmojiQuery(emojiInput, numOfEmojis, setOutputText, setOutputValidationStr)
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
    }, [emojiInput])

    return (
        <div className="emoji-generator">
            <GreenNavbar />
            <div className='emoji-generator-content-container'>
                <h1 className="project-title">😎 Emoji Generator 🤗</h1>
                <p className="project-description">
                    Enter a phrase to get an emoji representation.
                </p>

                <h4 className="project-mini-title">Text Input:</h4>
                <input 
                    type="text" 
                    className="input-box"
                    placeholder="ex: New York City" 
                    value={emojiInput}
                    ref={emojiInputRef}
                    onFocus={() => setEmojiInputFocussed(true)}
                    onBlur={() => setEmojiInputFocussed(false)}
                    onChange={(e) => setEmojiInput(e.target.value)}>
                </input>

                <button 
                    className="emoji-generator-submit-btn"
                    onClick={() => makeEmojiQuery(emojiInput, numOfEmojis, setOutputText, setOutputValidationStr)}>
                        Submit
                </button>

                <div className="emoji-generator-output-container">
                    <OutputBox 
                        titleText={"input: " + `${outputValidationStr}`}
                        outputText={outputText} />
                </div>

                <div className="emoji-generator-settings-container">
                    <h4>Settings</h4>

                    <p>Set the amount of emojis displayed in the output</p>

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
            </div>
            <Footer />
        </div>
    )
}

export default EmojiGenerator
