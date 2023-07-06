import React from 'react'
import './ImageGeneration.css'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// image size (either 256, 512, or 1024)
const SIZE = "256x256"

async function generateImage(currentWord, setCurrentWord) {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: currentWord.mentalImage,
            n: 1,
            size: SIZE
        })
    }
    try {
        // Sending the API request and getting the response
        const response = await fetch('https://api.openai.com/v1/images/generations', options);
        const data = await response.json();
        const url = data.data[0].url;

        // update current word's url
        setCurrentWord(prevCurrentWord => ({
            ...prevCurrentWord,
            url: url
        }))
        // setUrl(url);
        
      } catch(error) {
        console.error(error);
      }
}

function ImageGeneration( {currentWord, setCurrentWord} ) {

    
    // const [url, setUrl] = React.useState("");

    return (
        <div className="image-generation">
            <h4 className="project-mini-title img-gen-title ll-title">IMAGE GENERATION</h4>
            <div className="ll-img-container">
                {(currentWord === null || currentWord.url === "") && <p className='ll-img-msg'>Generate an image to help remember the association!</p>}
                {currentWord !== null && currentWord.url !== "" && <img src={currentWord.url}></img>}
            </div>
            <button 
                className="submit-btn get-img-btn ll-btn"
                onClick={() => generateImage(currentWord, setCurrentWord)}>
                    Get Image
            </button>
        </div>
    )
}

export default ImageGeneration
