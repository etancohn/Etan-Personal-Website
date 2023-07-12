import React from 'react'
import './Languages.css'

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

function Languages( {language, setLanguage} ) {
    return (
        <>
        <h4 className="project-mini-title ll-language-title ll-title">LANGUAGES</h4>
        <div className="ll-languages-options">
            <ToggleButtonGroup vertical type="radio" name="ll-language-options" value={language}>
                <ToggleButton value="Arabic" onClick={() => setLanguage("Arabic")} 
                              className={`ll-language-btn selected-language-${language === "Arabic"}`}>
                    Arabic
                </ToggleButton>
                <ToggleButton value="Chinese" onClick={() => setLanguage("Chinese")} 
                              className={`ll-language-btn selected-language-${language === "Chinese"}`}>
                    Chinese
                </ToggleButton>
                <ToggleButton value="Dutch" onClick={() => setLanguage("Dutch")} 
                              className={`ll-language-btn selected-language-${language === "Dutch"}`}>
                    Dutch
                </ToggleButton>
                <ToggleButton value="French" onClick={() => setLanguage("French")} 
                              className={`ll-language-btn selected-language-${language === "French"}`}>
                    French
                </ToggleButton>
                <ToggleButton value="German" onClick={() => setLanguage("German")} 
                              className={`ll-language-btn selected-language-${language === "German"}`}>
                    German
                </ToggleButton>
                <ToggleButton value="Hebrew" onClick={() => setLanguage("Hebrew")} 
                              className={`ll-language-btn selected-language-${language === "Hebrew"}`}>
                    Hebrew
                </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup vertical type="radio" name="ll-language-options" value={language}>
                <ToggleButton value="Italian" onClick={() => setLanguage("Italian")} 
                              className={`ll-language-btn selected-language-${language === "Italian"}`}>
                    Italian
                </ToggleButton>
                <ToggleButton value="Korean" onClick={() => setLanguage("Korean")} 
                              className={`ll-language-btn selected-language-${language === "Korean"}`}>
                    Korean
                </ToggleButton>
                <ToggleButton value="Japanese" onClick={() => setLanguage("Japanese")} 
                              className={`ll-language-btn selected-language-${language === "Japanese"}`}>
                    Japanese
                </ToggleButton>
                <ToggleButton value="Portuguese" onClick={() => setLanguage("Portuguese")} 
                              className={`ll-language-btn selected-language-${language === "Portuguese"}`}>
                    Portuguese
                </ToggleButton>
                <ToggleButton value="Russian" onClick={() => setLanguage("Russian")} 
                              className={`ll-language-btn selected-language-${language === "Russian"}`}>
                    Russian
                </ToggleButton>
                <ToggleButton value="Spanish" onClick={() => setLanguage("Spanish")} 
                              className={`ll-language-btn selected-language-${language === "Spanish"}`}>
                    Spanish
                </ToggleButton>
            </ToggleButtonGroup>

        </div>
        </>
    )
}

export default Languages
