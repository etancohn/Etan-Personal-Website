import React from 'react'
import './ImageGeneration.css'
import Spinner from 'react-bootstrap/Spinner';

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// image size (either 256, 512, or 1024)
const SIZE = "256x256"

async function generateImage(currentWord, setCurrentWord, imagesLeft, setImagesLeft, setIsLoading, setHistory) {
    if (currentWord.mentalImage === "" || imagesLeft <= 0) {
        return
    }
    setIsLoading(true)
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
        setHistory(prevHistory => {
            let updatedHistory = [...prevHistory]
            updatedHistory[prevHistory.length - 1].url = url
            return updatedHistory
        })
        if (imagesLeft > 0) {
            setImagesLeft(imagesLeft - 1)
        }        
      } catch(error) {
        console.error(error);
      }
}

function ImageGeneration( {currentWord, setCurrentWord, setHistory} ) {
    const [imagesLeft, setImagesLeft] = React.useState(2)
    const [isLoading, setIsLoading] = React.useState(false)

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

    return (
        <div className="image-generation">
            <h4 className="project-mini-title ll-img-gen-title ll-title">IMAGE GENERATION</h4>
                <div className={`ll-img-container ll-img-is-loading-${isLoading}`}>
                    {currentWord.url === "" && <p className='ll-img-msg'>Generate an image to help remember the association!</p>}
                    {currentWord.url !== "" && <img src={currentWord.url}></img>}
                    <div className="spinner-container">
                        {isLoading && <Spinner animation="border" className="my-spinner" />}
                    </div>
                </div>
            <div className='ll-no-images-left'>{imagesLeft <= 0 && 
                <p>Sorry, you are out of your image allotment!</p>}
            </div>
            <button 
                className={`submit-btn ll-get-img-btn ll-btn ll-img-btn-out-${imagesLeft <= 0}`}
                onClick={() => generateImage(currentWord, setCurrentWord, imagesLeft, setImagesLeft, setIsLoading, setHistory)}>
                    Get Image
            </button>
            <div className='ll-images-left'>{`(Images Left: ${imagesLeft})`}</div>
        </div>
    )
}

export default ImageGeneration
