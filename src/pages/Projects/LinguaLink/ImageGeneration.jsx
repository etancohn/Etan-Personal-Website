import React from 'react'
import './ImageGeneration.css'
import Spinner from 'react-bootstrap/Spinner';

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// changeable constants
const SIZE = "256x256"     // image size (either 256, 512, or 1024)
const NUM_FREE_IMAGES = 5


async function generateImage(currentWord, setCurrentWord, imagesLeft, setImagesLeft, setIsLoading, setHistory, 
                             currentWordIndex) {
    if (currentWord.mentalImage === "" || imagesLeft <= 0) {
        return
    }
    setIsLoading(true)

    // remove the word 'imagine'
    let imagePrompt = currentWord.mentalImage
    const words = imagePrompt.split(" ")
    if (words[0] === "Imagine") {
        imagePrompt = words.slice(1).join(" ")
    }
    console.log(imagePrompt)

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: imagePrompt,
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
            url: url,
            hasImage: true
        }))
        setHistory(prevHistory => {
            let updatedHistory = [...prevHistory]
            updatedHistory[currentWordIndex].url = url
            updatedHistory[currentWordIndex].hasImage = true
            return updatedHistory
        })
        if (imagesLeft > 0) {
            setImagesLeft(imagesLeft - 1)
        }        
      } catch(error) {
        console.error(error);
      }
}

function imageDisplay(url, isLoading, imagesLeft, imageExpired, setImageExpired) {
    const displayDefaultMsg = (url === "" && imagesLeft > 0)
    const displayImage = (url !== "" && !imageExpired)
    const displayExpiredMsg = (url !== "" && imageExpired)
    const displayNoImagesLeftMsg = (url === "" && imagesLeft <= 0)
    return (
        <div className={`ll-img-container ll-img-is-loading-${isLoading}`}>
            {displayDefaultMsg && <p className='ll-img-msg'>Generate an image to help remember the association!</p>}
            {displayImage && 
                    <img src={url} alt="word association mental image" onError={() => setImageExpired(true)}>
                    </img>}
            {displayExpiredMsg && <p className="ll-img-msg ll-image-italic-msg">Image expired.</p>}
            {displayNoImagesLeftMsg && <p className="ll-img-msg ll-image-italic-msg">Sorry, you are out of your image allotment.</p>}
            <div className="spinner-container">
                {isLoading && <Spinner animation="border" className="my-spinner" />}
            </div>
        </div>
    )
}

function ImageGeneration( {currentWord, setCurrentWord, setHistory, currentWordIndex} ) {
    const [imagesLeft, setImagesLeft] = React.useState(NUM_FREE_IMAGES)
    const [isLoading, setIsLoading] = React.useState(false)
    const [imageExpired, setImageExpired] = React.useState(false)

    // Load state from local storage on component mount
    React.useEffect(() => {
        const storedImagesLeft = window.localStorage.getItem('imagesLeft');
        if (storedImagesLeft) {
        setImagesLeft(JSON.parse(storedImagesLeft));
        }
    }, []);

    React.useEffect(() => {
        window.localStorage.setItem('imagesLeft', JSON.stringify(imagesLeft))
        setIsLoading(false)
    }, [imagesLeft])

    React.useEffect(() => {
        setImageExpired(false)
    }, [currentWord])

    return (
        <div className="image-generation">
            {/* <h4 className="project-mini-title ll-img-gen-title ll-title">IMAGE GENERATION</h4> */}
            {imageDisplay(currentWord.url, isLoading, imagesLeft, imageExpired, setImageExpired)}
            <button 
                className={`submit-btn ll-get-img-btn ll-btn ll-img-btn-out-${imagesLeft <= 0}`}
                onClick={() => generateImage(currentWord, setCurrentWord, imagesLeft, setImagesLeft, setIsLoading, setHistory,
                                             currentWordIndex)}>
                    Get Image
            </button>
            <div className='ll-images-left'>{`(Images Left: ${imagesLeft})`}</div>
        </div>
    )
}

export default ImageGeneration
