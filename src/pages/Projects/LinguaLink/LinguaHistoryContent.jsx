import React from 'react'
import "./LinguaHistoryContent.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons';
// import { faImage } from '@fortawesome/free-solid-svg-icons'

function handleHistoryItemClicked (setCurrentWord, newWord, numHistoryClicks, setNumHistoryClicks, i, setCurrentWordIndex) {
    setCurrentWord(newWord)
    setNumHistoryClicks(numHistoryClicks + 1)
    setCurrentWordIndex(i)
}

function LLHistoryItem (item, i, history, setCurrentWord, numHistoryClicks, setNumHistoryClicks, currentWordIndex,
                        setCurrentWordIndex) {
    const isCurrentWord = (currentWordIndex === i)
    return (
        <div className="ll-history-item" key={i}>
            <div className="square-container">
                <div className={`square square-${i % 5}`}></div>
            </div>
            <div className="ll-history-item-container">
                <span onClick={() => 
                    handleHistoryItemClicked(setCurrentWord, history[i], numHistoryClicks, setNumHistoryClicks,i, 
                                             setCurrentWordIndex)}>
                    <div className={`ll-history-item-text ll-current-word-${isCurrentWord}`}>
                        {item.word}
                    </div>
                </span>
                {item.hasImage && <FontAwesomeIcon className='ll-image-icon' icon={faImage} />}
            </div>
        </div>
    )
}

function LinguaHistoryContent( {history, setCurrentWord, numHistoryClicks, setNumHistoryClicks, currentWordIndex, setCurrentWordIndex} ) {
  return (
    <div className="ll-history-sidebar">
        {history.slice().reverse().map((item, i) => (
            LLHistoryItem(item, history.length - i - 1, history, setCurrentWord, numHistoryClicks, setNumHistoryClicks,
                            currentWordIndex, setCurrentWordIndex)
        ))}
    </div>
  )
}

export default LinguaHistoryContent
