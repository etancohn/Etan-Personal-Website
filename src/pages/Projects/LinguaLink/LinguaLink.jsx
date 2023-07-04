import React from 'react'
import GreenNavbar from '../../../components/GreenNavbar'
import Footer from '../../../components/Footer'
import './LinguaLink.css'
import OutputBox from '../../../components/OutputBox'

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
        setOutputValidationStr(`'${vocabWord}'`)
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
    // console.log('Translation:', translation);
    // console.log('Association:', association);
    // console.log('Mental Image:', mentalImage);
    // console.log('Explanation:', explanation);
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

  React.useEffect(() => {
    extractValues(outputText, setTranslation, setAssociation, setMentalImage, setExplanation);
  }, [outputText])

  React.useEffect(() => {
    console.log(url);
  }, [url])

  return (
    <>
    <div className="lingua-link-content">
        <GreenNavbar />
        <div className="lingua-link-content-container">

            {/* title and description */}
            <h1 className="project-title">Lingua Link</h1>
            <p className="project-description">Tool for learning new Spanish vocab words.</p>

            {/* user input for vocab word */}
            <div className="vocab-input-container">
                <h4 className="project-mini-title">Vocab Word</h4>
                <input 
                    className="vocab-word-input"
                    type="text" 
                    placeholder="ex: invierno" 
                    value={vocabWord}
                    onChange={(e) => setVocabWord(e.target.value)}>
                </input>
                <button 
                    className="submit-btn"
                    onClick={() => makeGPTCall(vocabWord, setOutputText, setOutputValidationStr)}>
                        Submit
                </button>
            </div>

            <div className="output-box-container">
                <h4>{`input: ${outputValidationStr}`}</h4>
                <p>{`Translation: ${translation}`}</p>
                <p>{`Association: ${association}`}</p>
                <p>{`Mental Image: ${mentalImage}`}</p>
                <p>{`Explanation: ${explanation}`}</p>
                {/* <OutputBox 
                    titleText={"input: " + `${outputValidationStr}`}
                    outputText={outputText} /> */}
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
