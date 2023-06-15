import { useState } from 'react';
import './MusicGenres.css';
import GreenNavbar from '../../../components/GreenNavbar';
import React from 'react';
import Footer from '../../../components/Footer';
import OutputBox from '../../../components/OutputBox';
import '../../../global.css';

// API Key for authentication
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// Function to get results from the API
async function getResults(song, artist, setOutputText, setOutputValidationStr) {
  // Query string for the API request
  const query = `
  Give answer in the following example format that gives the genres of an input song. Include no more than 4 genres and no less than 1 genre:

  example format:

  input: Song by Artist
  Genre One, Genre Two, Genre Three

  input: ${song} by ${artist}
  `;

  // Options for the API request
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: query }],
      max_tokens: 100,
      temperature: 0   // makes it more deterministic
    })
  };

  try {
    // Sending the API request and getting the response
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    
    // Updating the output text with the received response
    setOutputText(data.choices[0].message.content);
    setOutputValidationStr(`'${song}' by '${artist}'`)
  } catch(error) {
    console.error(error);
  }
}

export default function MusicGenres() {
  // State variables for song name, artist name, and output text
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [outputText, setOutputText] = useState("Enter a song above!");
  const [outputValidationStr, setOutputValidationStr] = useState("");
  const [songInputFocussed, setSongInputFocussed] = useState(false);
  const [artistInputFocussed, setArtistInputFocussed] = useState(false);

  const songInputRef = React.useRef(null)
  const artistInputRef = React.useRef(null)

  const handleKeyPressed = (e) => {
    // if enter is pushed, either change focus to second input or make API call
    if (e.key === 'Enter') {
      if (songInputFocussed) {   
        artistInputRef.current.focus()
      } else if (artistInputFocussed) {
        getResults(songName, artistName, setOutputText, setOutputValidationStr)
      }
    }
  }

  // Add event listener to check if a key is pressed
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPressed)

    return () => {
      // cleanup
      document.removeEventListener('keydown', handleKeyPressed)
    }
  }, [songName, artistName])

  return (
    <>
    <div className="music-genres-content">
      <GreenNavbar />
      <div className="music-genres-content-container">
        <h1 className="project-title">Song Genres</h1>
        <p className="project-description">
          Enter a song and the artist below, then press submit to display the song's genres.
        </p>

        <div className="music-genres-inputs-container">
          <div className="song-input">
            <h4 className='project-mini-title'>Song</h4>
            <input 
              type="text" 
              placeholder="ex: The Pretender" 
              value={songName}
              ref={songInputRef}
              onFocus={() => setSongInputFocussed(true)}
              onBlur={() => setSongInputFocussed(false)}
              onChange={(e) => setSongName(e.target.value)}>
            </input>
          </div>

          <div className="artist-input">
            <h4 className="project-mini-title">Artist</h4>
            <input 
              type="text" 
              placeholder="ex: Foo Fighters" 
              value={artistName}
              ref={artistInputRef}
              onFocus={() => setArtistInputFocussed(true)}
              onBlur={() => setArtistInputFocussed(false)}
              onChange={(e) => setArtistName(e.target.value)}>
            </input>
          </div>
        </div>

        <button 
          className="submit-btn"
          onClick={() => getResults(songName, artistName, setOutputText, setOutputValidationStr)}>
            Submit
        </button>

        <div className="output-box-container">
          <OutputBox 
            titleText={"input: " + `${outputValidationStr}`}
            outputText={outputText} />
        </div>

      </div>
    </div>

    <Footer />
    </>
  );
}
