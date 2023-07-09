import React from 'react'
import './AudioButton.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

// api key stored in an env
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_APPLICATION_CREDENTIALS
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OATH_CLIENT_ID

function initClient() {
  gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      scope: "",
  }).then(() => {
      // Authorization successful, you can now make API requests.
  }, (error) => {
      // Error occurred during authorization.
      console.error('Error initializing the client:', error);
  });
}

async function makeApiRequest(text) {
    if (text === "") { return }
    const request = {
      path: 'https://texttospeech.googleapis.com/v1/text:synthesize',
      method: 'POST',
      body: {
        input: { text: text },
        voice: { 
            languageCode: 'es-US',
            name: "es-US-Neural2-A",
        },
        audioConfig: { 
          audioEncoding: 'MP3',
          speakingRate: 0.7,    // slowed down a little bit for the user
        },
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

function AudioButton( {text} ) {
  let audioText = text
  if (text === false) {
    audioText = ""
  }
    React.useEffect(() => {
      gapi.load('client:auth2', () => {
        initClient();
      });
    }, []);

    return (
      <button 
          className={`ll-audio-btn ll-audio-btn-off-${audioText === ""}`}
          onClick={() => makeApiRequest(audioText)}>
              <FontAwesomeIcon icon={audioText === "" ? faVolumeMute : faVolumeUp} />
      </button>
    )
}

export default AudioButton
