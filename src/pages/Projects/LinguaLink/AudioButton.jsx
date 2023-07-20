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
const ARABIC_VOICE_LANGUAGE_CODE = 'ar-XA'
const ARABIC_VOICE_NAME = "ar-XA-Wavenet-B"
const FRENCH_VOICE_LANGUAGE_CODE = 'fr-FR'
const FRENCH_VOICE_NAME = "fr-FR-Wavenet-E"
const GERMAN_VOICE_LANGUAGE_CODE = 'de-DE'
const GERMAN_VOICE_NAME = "de-DE-Wavenet-B"
const PORTUGUESE_VOICE_LANGUAGE_CODE = 'pt-BR'
const PORTUGUESE_VOICE_NAME = "pt-BR-Wavenet-B"
const KOREAN_VOICE_LANGUAGE_CODE = 'ko-KR'
const KOREAN_VOICE_NAME = "ko-KR-Wavenet-A"
const CHINESE_VOICE_LANGUAGE_CODE = 'cmn-CN'
const CHINESE_VOICE_NAME = "cmn-CN-Wavenet-B"
const DUTCH_VOICE_LANGUAGE_CODE = 'nl-NL'
const DUTCH_VOICE_NAME = "nl-NL-Wavenet-B"
const HEBREW_VOICE_LANGUAGE_CODE = 'he-IL'
const HEBREW_VOICE_NAME = "he-IL-Wavenet-A"
const ITALIAN_VOICE_LANGUAGE_CODE = 'it-IT'
const ITALIAN_VOICE_NAME = "it-IT-Wavenet-A"
const JAPANESE_VOICE_LANGUAGE_CODE = 'ja-JP'
const JAPANESE_VOICE_NAME = "ja-JP-Wavenet-B"
const RUSSIAN_VOICE_LANGUAGE_CODE = 'ru-RU'
const RUSSIAN_VOICE_NAME = "ru-RU-Wavenet-B"

function getLanguageCode(language) {
  if (language === "Spanish") { return SPANISH_VOICE_LANGUAGE_CODE }
  else if (language === "Arabic") { return ARABIC_VOICE_LANGUAGE_CODE }
  else if (language === "French") { return FRENCH_VOICE_LANGUAGE_CODE }
  else if (language === "German") { return GERMAN_VOICE_LANGUAGE_CODE }
  else if (language === "Portuguese") { return PORTUGUESE_VOICE_LANGUAGE_CODE }
  else if (language === "Korean") { return KOREAN_VOICE_LANGUAGE_CODE }
  else if (language === "Chinese") { return CHINESE_VOICE_LANGUAGE_CODE }
  else if (language === "Dutch") { return DUTCH_VOICE_LANGUAGE_CODE }
  else if (language === "Hebrew") { return HEBREW_VOICE_LANGUAGE_CODE }
  else if (language === "Italian") { return ITALIAN_VOICE_LANGUAGE_CODE }
  else if (language === "Japanese") { return JAPANESE_VOICE_LANGUAGE_CODE }
  else if (language === "Russian") { return RUSSIAN_VOICE_LANGUAGE_CODE }
  else {console.log("ERROR: No language code found.")}
}

function getVoiceName(language) {
  if (language === "Spanish") { return SPANISH_VOICE_NAME }
  else if (language === "Arabic") { return ARABIC_VOICE_NAME }
  else if (language === "French") { return FRENCH_VOICE_NAME }
  else if (language === "German") { return GERMAN_VOICE_NAME }
  else if (language === "Portuguese") { return PORTUGUESE_VOICE_NAME }
  else if (language === "Korean") { return KOREAN_VOICE_NAME }
  else if (language === "Chinese") { return CHINESE_VOICE_NAME }
  else if (language === "Dutch") { return DUTCH_VOICE_NAME }
  else if (language === "Hebrew") { return HEBREW_VOICE_NAME }
  else if (language === "Italian") { return ITALIAN_VOICE_NAME }
  else if (language === "Japanese") { return JAPANESE_VOICE_NAME }
  else if (language === "Russian") { return RUSSIAN_VOICE_NAME }
  else {console.log("ERROR: No voice name found.")}
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

async function makeApiRequest(text, currentWord) {
    if (text === "") { return }
    const regexRemoveParen = /\s*\([^)]*\)/
    const updatedText = text.replace(regexRemoveParen, '');
    const request = {
      path: 'https://texttospeech.googleapis.com/v1/text:synthesize',
      method: 'POST',
      body: {
        input: { text: updatedText },
        voice: { 
            languageCode: getLanguageCode(currentWord.language),
            name: getVoiceName(currentWord.language),
        },
        audioConfig: { 
          audioEncoding: 'MP3',
          speakingRate: SPEAKING_RATE,  
        },
      },
    };
    gapi.client.request(request).then((response) => {
        // Handle the API response. 

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

function AudioButton( {text, currentWord} ) {
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
          onClick={() => makeApiRequest(audioText, currentWord)}>
              <FontAwesomeIcon icon={audioText === "" ? faVolumeMute : faVolumeUp} />
      </button>
    )
}

export default AudioButton
