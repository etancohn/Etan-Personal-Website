import React from 'react'
import './ImageGeneration.css'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import main_logo from './pics/main_logo.png'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// changeable constants
const SIZE = "256x256"     // image size (either 256, 512, or 1024)
const NUM_DAILY_IMAGES = 3
const NUM_START_IMAGES = 5


async function generateImage(currentWord, setCurrentWord, imagesLeft, setImagesLeft, setIsLoading, setHistory, 
                             currentWordIndex, setShow) {
    if (currentWord.mentalImage === "" || imagesLeft <= 0) {
        return
    }
    setIsLoading(true)

    if (imagesLeft === NUM_START_IMAGES) {
        setShow(true)
    }

    // remove the word 'imagine'
    let imagePrompt = currentWord.mentalImage
    const words = imagePrompt.split(" ")
    if (words[0] === "Imagine") {
        imagePrompt = words.slice(1).join(" ")
    }

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
            {<Spinner className={`ll-img-spinner-loading-${isLoading}`} animation="border" variant="dark" />}
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
    const [show, setShow] = React.useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    // Load state from local storage on component mount
    React.useMemo(() => {
        const storedImagesLeft = window.localStorage.getItem('imagesLeft');
        if (!storedImagesLeft) {
            setImagesLeft(NUM_START_IMAGES)
            const todayDate = getTodayDate()
            window.localStorage.setItem('prevDate', JSON.stringify(todayDate))
            return
        }
        let prevDate = window.localStorage.getItem('prevDate')
        prevDate = JSON.parse(prevDate)
        if (!prevDate) {
            console.log(`ERROR: Date not found in local storage.`)
            return
        }
        const todayDate = getTodayDate()
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
                                             currentWordIndex, setShow)}>
                    Get Image
            </button>
            <div className='ll-images-left'>{`(Images Left: ${imagesLeft})`}</div>
            <Modal
            show={show}
            onHide={handleClose}
            size='md'
            backdrop="static"
            keyboard={false}
            className="ll-modals"
        >
            <Modal.Header closeButton>
                <div className="ll-modal-header-container">
                    <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
                    <Modal.Title className="ll-info-modal-title">IMAGE INFORMATION</Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body className="ll-info-modal-body">
                <p>
                    {`You've been given ${NUM_START_IMAGES} free image generations! After you've used your 
                    extra images, your image count will reset daily to ${NUM_DAILY_IMAGES} images.`}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose} className='ll-info-modal-continue-btn'>
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}

export default ImageGeneration
