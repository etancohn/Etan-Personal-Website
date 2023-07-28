import React from 'react'
import './Languages.css'

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

function updateLanguage(newLanguage, setLanguage) {
    localStorage.setItem('language', newLanguage)
    setLanguage(newLanguage)
}

function Languages( {language, setLanguage} ) {
    return (
        <>
        <h4 className="project-mini-title ll-language-title ll-title">LANGUAGES</h4>
        <div className="ll-languages-options">
            <ToggleButtonGroup vertical type="radio" name="ll-language-options" value={language}>
                {/* <ToggleButton value="Arabic" onClick={() => updateLanguage("Arabic", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Arabic"}`}>
                    Arabic
                </ToggleButton> */}
                <ToggleButton value="Chinese" onClick={() => updateLanguage("Chinese", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Chinese"}`}>
                    Chinese
                </ToggleButton>
                {/* <ToggleButton value="Dutch" onClick={() => updateLanguage("Dutch", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Dutch"}`}>
                    Dutch
                </ToggleButton> */}
                <ToggleButton value="French" onClick={() => updateLanguage("French", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "French"}`}>
                    French
                </ToggleButton>
                <ToggleButton value="German" onClick={() => updateLanguage("German", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "German"}`}>
                    German
                </ToggleButton>
                {/* <ToggleButton value="Hebrew" onClick={() => updateLanguage("Hebrew", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Hebrew"}`}>
                    Hebrew
                </ToggleButton> */}
            </ToggleButtonGroup>

            <ToggleButtonGroup vertical type="radio" name="ll-language-options" value={language}>
                <ToggleButton value="Italian" onClick={() => updateLanguage("Italian", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Italian"}`}>
                    Italian
                </ToggleButton>
                {/* <ToggleButton value="Korean" onClick={() => updateLanguage("Korean", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Korean"}`}>
                    Korean
                </ToggleButton> */}
                <ToggleButton value="Japanese" onClick={() => updateLanguage("Japanese", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Japanese"}`}>
                    Japanese
                </ToggleButton>
                {/* <ToggleButton value="Portuguese" onClick={() => updateLanguage("Portuguese", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Portuguese"}`}>
                    Portuguese
                </ToggleButton> */}
                {/* <ToggleButton value="Russian" onClick={() => updateLanguage("Russian", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Russian"}`}>
                    Russian
                </ToggleButton> */}
                <ToggleButton value="Spanish" onClick={() => updateLanguage("Spanish", setLanguage)} 
                              className={`ll-language-btn selected-language-${language === "Spanish"}`}>
                    Spanish
                </ToggleButton>
            </ToggleButtonGroup>

        </div>
        </>
    )
}

export default Languages
