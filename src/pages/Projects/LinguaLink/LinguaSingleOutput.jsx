import React from 'react'
import AudioButton from './AudioButton'
import GenerationText from './GenerationText'
import './LinguaSingleOutput.css'

function LinguaSingleOutput( {logo, title="TITLE", text="", isEven=false, num="0",
                              triggerGeneration, onCompletion, triggerBlank, numHistoryClicks,
                              TEXT_GENERATION_SLOWNESS, language} ) {
    return (
        <div className={`ll-output-box-item-container ${isEven ? "even-output-item" : "odd-output-item"} ll-num-${num}`}>
            <img className="ll-output-box-logo" src={logo} />
            <div className="ll-output-box-item">
                <div className="ll-item-text">
                    <div className={num === "1" ? `ll-item-title-with-audio-container` : "ignore"}>
                        <h4 className={`ll-item-title ll-title-${num}`}>{`${title}`}</h4>
                        {num === "1" && <AudioButton text={text} language={language} />}
                    </div>
                    <div className="ll-my-wrapper">
                        <p className={`ll-output-text ll-output-text-${num}`}>
                            <GenerationText text={text.trim()} slowness={TEXT_GENERATION_SLOWNESS} triggerGeneration={triggerGeneration} 
                                            num={parseInt(num)} onCompletion={onCompletion} triggerBlank={triggerBlank}
                                            numHistoryClicks={numHistoryClicks} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinguaSingleOutput
