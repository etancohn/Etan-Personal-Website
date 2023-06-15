import React from 'react'
import './OutputBox.css'

function OutputBox( {titleText="TITLE", outputText="OUTPUT"} ) {
  return (
    <div className="output-box">
        <h6 className="output-box-title">{titleText}</h6>
        <p className="output-box-text">{outputText}</p>
      
    </div>
  )
}

export default OutputBox
