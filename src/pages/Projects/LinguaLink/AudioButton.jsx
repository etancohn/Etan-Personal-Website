import React from 'react'
import './AudioButton.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

// api key stored in an env
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_APPLICATION_CREDENTIALS
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OATH_CLIENT_ID

// Website to test voices: https://cloud.google.com/text-to-speech#section-2
// changeable constants
const SPEAKING_RATE = 0.7  // slowed down a little bit for the user
const SPANISH_VOICE_LANGUAGE_CODE = 'es-US'
const SPANISH_VOICE_NAME = "es-US-Neural2-A"
const ENGLISH_VOICE_LANGUAGE_CODE = 'en-US'
const ENGLISH_VOICE_NAME = "en-US-Wavenet-I"
const FRENCH_VOICE_LANGUAGE_CODE = 'fr-FR'
const FRENCH_VOICE_NAME = "fr-FR-Wavenet-E"
const GERMAN_VOICE_LANGUAGE_CODE = 'de-DE'
const GERMAN_VOICE_NAME = "de-DE-Wavenet-B"
const PORTUGUESE_VOICE_LANGUAGE_CODE = 'pt-BR'
const PORTUGUESE_VOICE_NAME = "pt-BR-Wavenet-B"
const KOREAN_VOICE_LANGUAGE_CODE = 'ko-KR'
const KOREAN_VOICE_NAME = "ko-KR-Wavenet-A"

function getLanguageCode(language) {
  if (language === "Spanish") { return SPANISH_VOICE_LANGUAGE_CODE }
  else if (language === "English") { return ENGLISH_VOICE_LANGUAGE_CODE }
  else if (language === "French") { return FRENCH_VOICE_LANGUAGE_CODE }
  else if (language === "German") { return GERMAN_VOICE_LANGUAGE_CODE }
  else if (language === "Portuguese") { return PORTUGUESE_VOICE_LANGUAGE_CODE }
  else if (language === "Korean") { return KOREAN_VOICE_LANGUAGE_CODE }
  else {error("ERROR: No language code found.")}
}

function getVoiceName(language) {
  if (language === "Spanish") { return SPANISH_VOICE_NAME }
  else if (language === "English") { return ENGLISH_VOICE_NAME }
  else if (language === "French") { return FRENCH_VOICE_NAME }
  else if (language === "German") { return GERMAN_VOICE_NAME }
  else if (language === "Portuguese") { return PORTUGUESE_VOICE_NAME }
  else if (language === "Korean") { return KOREAN_VOICE_NAME }
  else {error("ERROR: No voice name found.")}
}


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

async function makeApiRequest(text, language) {
    if (text === "") { return }
    const request = {
      path: 'https://texttospeech.googleapis.com/v1/text:synthesize',
      method: 'POST',
      body: {
        input: { text: text },
        voice: { 
            languageCode: getLanguageCode(language),
            name: getVoiceName(language),
        },
        audioConfig: { 
          audioEncoding: 'MP3',
          speakingRate: SPEAKING_RATE,  
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

function AudioButton( {text, language} ) {
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
          onClick={() => makeApiRequest(audioText, language)}>
              <FontAwesomeIcon icon={audioText === "" ? faVolumeMute : faVolumeUp} />
      </button>
    )
}

export default AudioButton
