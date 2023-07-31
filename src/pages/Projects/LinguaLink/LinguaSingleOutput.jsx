import React from 'react'
import AudioButton from './AudioButton'
import GenerationText from './GenerationText'
import './LinguaSingleOutput.css' 

function LinguaSingleOutput( {logo, title="TITLE", text="", num="0",
                              triggerGeneration, onCompletion, triggerBlank, numHistoryClicks,
                              TEXT_GENERATION_SLOWNESS, language, currentWord, infinitive="",
                            secondTriggerGeneration=null, secondOnCompletion=null,
                            setDisplayExtraMnemonics=() => {}} ) {
    return (
        <div className={`ll-output-box-item-container ll-num-${num}`}>
            <img className="ll-output-box-logo" src={logo} />
            <div className="ll-output-box-item">
                <div className="ll-item-text">
                    <div className="ll-item-title-container">
                        <h4 className={`ll-item-title ll-title-${num}`}>{`${title}`}</h4>
                        {num === "1" && <AudioButton text={text} language={language} currentWord={currentWord} />}
                        {
                            num === "3" &&
                            <div className="ll-more-mnemonics-btn" onClick={() => setDisplayExtraMnemonics(true)}></div>
                        }
                    </div>
                    <div className="ll-my-wrapper">
                        <div className={`ll-output-text ll-output-text-${num}`}>
                            <GenerationText text={text.trim()} slowness={TEXT_GENERATION_SLOWNESS} triggerGeneration={triggerGeneration} 
                                            onCompletion={onCompletion} triggerBlank={triggerBlank}
                                            numHistoryClicks={numHistoryClicks} />
                            {
                                num === "1" && 
                                infinitive !== "" && 
                                (<div>
                                    <GenerationText text={`infinitive: ${infinitive}`} slowness={TEXT_GENERATION_SLOWNESS}
                                                triggerGeneration={secondTriggerGeneration} onCompletion={secondOnCompletion} 
                                                triggerBlank={triggerBlank}
                                                numHistoryClicks={numHistoryClicks} />
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinguaSingleOutput
