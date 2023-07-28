import React from 'react'

// generates text, one letter at a time. slowness effects how quickly the text gets generated
function GenerationText( { text="", slowness, triggerGeneration, onCompletion, triggerBlank, numHistoryClicks } ) {
    const [content, setContent] = React.useState('')

    // set the content immediately to the word when a history item gets clicked
    React.useEffect(() => {
        setContent(text)
    }, [numHistoryClicks])

    React.useEffect(() => {
        if (!triggerBlank) { return }
        setContent('')
    }, [triggerBlank])

    React.useMemo(() => {
        const generateContent = async () => {
          if (!triggerGeneration) {
            return;
          }
          const letters = text.split('');
          let newContent = '';
    
          for (let index = 0; index < letters.length; index++) {
            const letter = letters[index];
    
            await new Promise((resolve) =>
              setTimeout(() => {
                newContent += letter;
                setContent(newContent);
                resolve();
              }, slowness)
            );
          }
    
          onCompletion();
        };
    
        generateContent();
      }, [triggerGeneration])

  return (
    <span>{content}</span>
  )
}

export default GenerationText
