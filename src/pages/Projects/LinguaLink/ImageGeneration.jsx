import React from 'react'
import './ImageGeneration.css'

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// const GOOGLE_KEY = import.meta.env.GOOGLE_APPLICATION_CREDENTIALS

async function makeApiRequest(text) {
    const request = {
      path: 'https://texttospeech.googleapis.com/v1/text:synthesize',
      method: 'POST',
      body: {
        input: { text: text },
        voice: { 
            languageCode: 'es-US',
            name: "es-US-Neural2-A",
        },
        audioConfig: { audioEncoding: 'MP3' },
      },
    };
    gapi.client.request(request).then((response) => {
        // Handle the API response.
        console.log('API response:', response.result);
        // Write the binary audio content to a local file

        const base64AudioContent = response.result.audioContent
        const audioData = atob(base64AudioContent)
        // Convert the audio data to a Uint8Array
        const uint8Array = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
            uint8Array[i] = audioData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array.buffer], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();

    }, (error) => {
      // Error occurred during the API request.
      console.error('Error making the API request:', error);
    });
}

function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyB5S46hYjWkUeLMZEo5LS0whgeho5vwNAw',
        clientId: '1075434309218-olcafl3lj3p59ifarvpe0glucf1nkhcp.apps.googleusercontent.com',
        scope: "",
    }).then(() => {
        // Authorization successful, you can now make API requests.
    }, (error) => {
        // Error occurred during authorization.
        console.error('Error initializing the client:', error);
    });
}


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

    React.useEffect(() => {
        gapi.load('client:auth2', () => {
          initClient();
        });
      }, []);

    // React.useEffect(() => {
    //     async function quickStart() {
    //       const text = 'hello, world!';
    //       const client = new TextToSpeechClient({
    //         keyFilename: 'creds.json',
    //       });
    
    //       const request = {
    //         input: { text },
    //         voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    //         audioConfig: { audioEncoding: 'MP3' },
    //       };
    
    //       const [response] = await client.synthesizeSpeech(request);
    //       const writeFile = util.promisify(fs.writeFile);
    //       await writeFile('output.mp3', response.audioContent, 'binary');
    //       console.log('Audio content written to file: output.mp3');
    //     }
    
    //     quickStart();
    //   }, []);

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
            <button 
                className="ll-btn"
                onClick={() => makeApiRequest(currentWord.word)}>
                    Speech!
            </button>
        </div>
    )
}

export default ImageGeneration
