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
                <ToggleButton value="English" onClick={() => setLanguage("English")} 
                              className={`ll-language-btn selected-language-${language === "English"}`}>
                    English
                </ToggleButton>
                <ToggleButton value="French" onClick={() => setLanguage("French")} 
                              className={`ll-language-btn selected-language-${language === "French"}`}>
                    French
                </ToggleButton>
                <ToggleButton value="German" onClick={() => setLanguage("German")} 
                              className={`ll-language-btn selected-language-${language === "German"}`}>
                    German
                </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup vertical type="radio" name="ll-language-options" value={language}>
                <ToggleButton value="Korean" onClick={() => setLanguage("Korean")} 
                              className={`ll-language-btn selected-language-${language === "Korean"}`}>
                    Korean
                </ToggleButton>
                <ToggleButton value="Portuguese" onClick={() => setLanguage("Portuguese")} 
                              className={`ll-language-btn selected-language-${language === "Portuguese"}`}>
                    Portuguese
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
