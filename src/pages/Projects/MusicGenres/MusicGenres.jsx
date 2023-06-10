import { useState } from 'react';
import './MusicGenres.css';
import GreenNavbar from '../../../components/GreenNavbar';
import React from 'react';

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
      max_tokens: 100
    })
  };

  try {
    // Sending the API request and getting the response
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    
    // Updating the output text with the received response
    setOutputText(data.choices[0].message.content);
    setOutputValidationStr(`'${song}' by '${artist}':`)
  } catch(error) {
    console.error(error);
  }
}

export default function MusicGenres() {
  // State variables for song name, artist name, and output text
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [outputText, setOutputText] = useState("");
  const [outputValidationStr, setOutputValidationStr] = useState("");

  return (
    <div className="music-genres-content">
      <GreenNavbar />
      <h1 className="title">Song Genres</h1>
      <p className="description">
        Enter a song and the artist below, then press submit to display the song's genres.
      </p>
      <div className="grid-container">
        <div className="song-input">
          <h4>Song</h4>
          <input 
            type="text" 
            placeholder="ex: The Pretender" 
            value={songName}
            onChange={(e) => setSongName(e.target.value)}>
          </input>
        </div>

        <div className="artist-input">
          <h4>Artist</h4>
          <input 
            type="text" 
            placeholder="ex: Foo Fighters" 
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}>
          </input>
        </div>

        <button 
          className="submit-btn"
          onClick={() => getResults(songName, artistName, setOutputText, setOutputValidationStr)}>
            Submit
        </button>

        <div className="output">
          <span className="output-title">{outputValidationStr !== "" && `${outputValidationStr}`}</span>
          <span className="no-output-title">{outputValidationStr === "" && "Enter a song above!"}</span>
          <p className="output-text">{outputText}</p>
        </div>
      </div>
    </div>
  );
}
