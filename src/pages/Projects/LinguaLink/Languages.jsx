import React from 'react'
import './Languages.css'

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

function Languages( {language, setLanguage} ) {
    return (
        <>
        <h4 className="project-mini-title ll-language-title ll-title">LANGUAGE</h4>
        <div className="ll-languages-options">
            <ToggleButtonGroup vertical type="radio" name="ll-language-options" value={language}>
                <ToggleButton value="english" onClick={() => setLanguage("english")} 
                              className={`ll-language-btn selected-language-${language === "english"}`}>
                    English
                </ToggleButton>
                <ToggleButton value="french" onClick={() => setLanguage("french")} 
                              className={`ll-language-btn selected-language-${language === "french"}`}>
                    French
                </ToggleButton>
                <ToggleButton value="german" onClick={() => setLanguage("german")} 
                              className={`ll-language-btn selected-language-${language === "german"}`}>
                    German
                </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup vertical type="radio" name="ll-language-options" value={language}>
                <ToggleButton value="korean" onClick={() => setLanguage("korean")} 
                              className={`ll-language-btn selected-language-${language === "korean"}`}>
                    Korean
                </ToggleButton>
                <ToggleButton value="portuguese" onClick={() => setLanguage("portuguese")} 
                              className={`ll-language-btn selected-language-${language === "portuguese"}`}>
                    Portuguese
                </ToggleButton>
                <ToggleButton value="spanish" onClick={() => setLanguage("spanish")} 
                              className={`ll-language-btn selected-language-${language === "spanish"}`}>
                    Spanish
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
        </>
    )
}

export default Languages
