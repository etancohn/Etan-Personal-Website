import React from 'react'
import './ImageGeneration.css'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// image size (either 256, 512, or 1024)
const SIZE = "256x256"

async function generateImage(currentWord, setCurrentWord, imagesLeft, setImagesLeft) {
    if (imagesLeft <= 0) {
        return
    }
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
        if (imagesLeft > 0) {
            setImagesLeft(imagesLeft - 1)
        }
        // setUrl(url);
        
      } catch(error) {
        console.error(error);
      }
}

function ImageGeneration( {currentWord, setCurrentWord} ) {
    const [imagesLeft, setImagesLeft] = React.useState(2)

    // Load state from local storage on component mount
    React.useEffect(() => {
        const storedImagesLeft = window.localStorage.getItem('imagesLeft');
        if (storedImagesLeft) {
        setImagesLeft(JSON.parse(storedImagesLeft));
        }
    }, []);

    React.useEffect(() => {
        window.localStorage.setItem('imagesLeft', JSON.stringify(imagesLeft))
    }, [imagesLeft])

    
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
                onClick={() => generateImage(currentWord, setCurrentWord, imagesLeft, setImagesLeft)}>
                    Get Image
            </button>
            <div>{`(Images Left: ${imagesLeft})`}</div>
            <div>{imagesLeft <= 0 && <p className="ll-no-imgs-left">Sorry, you are out of your image allotment!</p>}</div>
        </div>
    )
}

export default ImageGeneration
