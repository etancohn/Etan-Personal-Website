import React from 'react'

// generates text, one letter at a time. slowness effects how quickly the text gets generated
function GenerationText( { text="", slowness=8 } ) {
    if (typeof text !== 'string') {
        text = ""
    }
    const letters = text.split('')
    const [content, setContent] = React.useState('')

    React.useEffect(() => {
        let newContent = '';
        letters.forEach((letter, index) => {
            const delay = (index + 1) * slowness; // Adjust the delay as needed
            setTimeout(() => {
                newContent += letter
                setContent(newContent)
            }, delay)
        });
    }, [text])

  return (
    <span>{content}</span>
  )
}

export default GenerationText
