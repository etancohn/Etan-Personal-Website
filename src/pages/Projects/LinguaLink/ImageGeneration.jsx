import React from 'react'
import './ImageGeneration.css'
import Spinner from 'react-bootstrap/Spinner';

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// changeable constants
const SIZE = "256x256"     // image size (either 256, 512, or 1024)
const NUM_DAILY_IMAGES = 3
const NUM_START_IMAGES = 10


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

function datesEqual(date1, date2) {
    const myDateFormatLength = 3
    if (date1.length !== myDateFormatLength || date2.length !== myDateFormatLength) {
        console.log(`ERROR: Dates not in correct format ('${date1}') ('${date2}')`)
        return false
    }
    if (date1[0] === date2[0] && date1[1] === date2[1] && date1[2] === date2[2]) {
        return true
    }
    return false
}
function getTodayDate() {
    const today = new Date()
    const res = [today.getDate(), today.getMonth(), today.getFullYear()]
    return res
}

function ImageGeneration( {currentWord, setCurrentWord, setHistory, currentWordIndex} ) {
    const [imagesLeft, setImagesLeft] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)
    const [imageExpired, setImageExpired] = React.useState(false)

    // Load state from local storage on component mount
    React.useMemo(() => {
        const storedImagesLeft = window.localStorage.getItem('imagesLeft');
        if (!storedImagesLeft) {
            setImagesLeft(NUM_START_IMAGES)
            const todayDate = getTodayDate()
            console.log(`todayDate: ${todayDate}`)
            window.localStorage.setItem('prevDate', JSON.stringify(todayDate))
            return
        }
        let prevDate = window.localStorage.getItem('prevDate')
        prevDate = JSON.parse(prevDate)
        console.log(`prevDate: ${prevDate}`)
        if (!prevDate) {
            console.log(`ERROR: Date not found in local storage.`)
            return
        }
        const todayDate = getTodayDate()
        console.log(`dates equal: ${datesEqual(prevDate, todayDate)}`)
        if (datesEqual(prevDate, todayDate)) {
            setImagesLeft(JSON.parse(storedImagesLeft));
            return
        }
        setImagesLeft(Math.max(JSON.parse(storedImagesLeft), NUM_DAILY_IMAGES))
        return
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
