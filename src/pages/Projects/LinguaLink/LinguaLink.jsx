import React from 'react'
import GreenNavbar from '../../../components/GreenNavbar'
import Footer from '../../../components/Footer'
import './LinguaLink.css'
import OutputBox from '../../../components/OutputBox'
import logo1 from '../../../pics/LinguaLink/logo_1.png'
import logo2 from '../../../pics/LinguaLink/logo_2.png'
import logo3 from '../../../pics/LinguaLink/logo_3.png'
import logo4 from '../../../pics/LinguaLink/logo_4.png'
import logo5 from '../../../pics/LinguaLink/logo_5.png'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// image size (either 256, 512, or 1024)
const SIZE = "256x256"

async function makeGPTCall(vocabWord, setOutputText, setOutputValidationStr) {
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
        setOutputText(data.choices[0].message.content);
        setOutputValidationStr(`${vocabWord}`)
      } catch(error) {
        console.error(error);
      }
}

async function generateImage(mentalImg, setUrl) {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: mentalImg,
            n: 1,
            size: SIZE
        })
    }
    try {
        // Sending the API request and getting the response
        const response = await fetch('https://api.openai.com/v1/images/generations', options);
        const data = await response.json();
        const url = data.data[0].url;
        setUrl(url);
        
      } catch(error) {
        console.error(error);
      }
}

function extractValues(outputText, setTranslation, setAssociation, setMentalImage, setExplanation) {
    const translationRegex = /Translation:\s(.+)/i;
    const associationRegex = /Association:\s(.+)/i;
    const mentalImageRegex = /Mental Image:\s(.+)/i;
    const explanationRegex = /Explanation:\s(.+)/i;
    
    const translationMatch = outputText.match(translationRegex);
    const associationMatch = outputText.match(associationRegex);
    const mentalImageMatch = outputText.match(mentalImageRegex);
    const explanationMatch = outputText.match(explanationRegex);
    
    const translation = translationMatch ? translationMatch[1] : '';
    const association = associationMatch ? associationMatch[1] : '';
    const mentalImage = mentalImageMatch ? mentalImageMatch[1] : '';
    const explanation = explanationMatch ? explanationMatch[1] : '';
    
    // Now you can use the extracted values as needed
    setTranslation(translation);
    setAssociation(association);
    setMentalImage(mentalImage);
    setExplanation(explanation);
}

// html for a single row of output
function LinguaSingleOutput( {logo=logo1, title="TITLE", outputText="text.", isEven=false, num=0} ) {
    return (
        <div className={`output-box-item-container ${isEven ? "even-output-item" : "odd-output-item"} num-${num}`}>
            <img className="output-box-logo" src={logo} />
            <div className="output-box-item">
                <div className="ll-item-text">
                    <h4 className={`ll-item-title title-${num}`}>{`${title}`}</h4>
                    <p className="ll-output-text">{`${outputText}`}</p>
                </div>
            </div>
        </div>
    )
}

function LinguaLink() {
  const [vocabWord, setVocabWord] = React.useState("")
  const [outputText, setOutputText] = React.useState("Enter a vocab word above!");
  const [outputValidationStr, setOutputValidationStr] = React.useState("");
  const [translation, setTranslation] = React.useState("");
  const [association, setAssociation] = React.useState("");
  const [mentalImage, setMentalImage] = React.useState("");
  const [explanation, setExplanation] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [vocabWordInputFocussed, setVocabWordInputFocussed] = React.useState(false);
  const vocabWordInputRef = React.useRef(null);

  React.useEffect(() => {
    extractValues(outputText, setTranslation, setAssociation, setMentalImage, setExplanation);
  }, [outputText])

  React.useEffect(() => {
    console.log(url);
  }, [url])

  // handle user pushing 'Enter'
  const handleKeyPressed = (e) => {
    // if enter is pushed, either change focus to vocab word input or make API call
    if (e.key === 'Enter') {
      if (vocabWordInputFocussed) {   
        makeGPTCall(vocabWord, setOutputText, setOutputValidationStr)
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
    <>
    <div className="lingua-link-content">
        <GreenNavbar />
        <div className="lingua-link-content-container">

            {/* title and description */}
            <h1 className="project-title">Lingua Link</h1>
            <p className="project-description">Elevate your Spanish vocabulary learning experience! Lingua Link employs powerful memory techniques to enhance your ability to learn, remember, and effortlessly recall new Spanish vocab words.</p>

            {/* user input for vocab word */}
            <div className="vocab-input-container">
                <h4 className="project-mini-title">Vocab Word</h4>
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
                    className="submit-btn"
                    onClick={() => makeGPTCall(vocabWord, setOutputText, setOutputValidationStr)}>
                        Submit
                </button>
            </div>

            <div className="output-box-container">
                <LinguaSingleOutput logo={logo1} title="YOUR WORD" outputText={outputValidationStr} isEven={true} num="1" />
                <LinguaSingleOutput logo={logo2} title="TRANSLATION" outputText={translation} num="2" />
                <LinguaSingleOutput logo={logo3} title="ASSOCIATION" outputText={association} isEven={true} num="3" />
                <LinguaSingleOutput logo={logo4} title="MENTAL IMAGE" outputText={mentalImage} num="4" />
                <LinguaSingleOutput logo={logo5} title="EXPLANATION" outputText={explanation} isEven={true} num="5" />
            </div>

            <button 
                    className="submit-btn get-img-btn"
                    onClick={() => generateImage(mentalImage, setUrl)}>
                        Get Image
                </button>
            
            {url !== "" && <img src={url}></img>}

        </div>
    </div>
    <Footer />
    </>
  )
}

export default LinguaLink
