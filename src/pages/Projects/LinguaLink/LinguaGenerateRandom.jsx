import React from 'react'
import './LinguaGenerateRandom.css'


function generateRandomWords()  {
    return [
        "abrumador",
        "efímero",
        "escéptico",
        "imperturbable",
        "enigmático",
        "despilfarro",
        "insólito",
        "desolación",
        "arrebatar"
      ]
}

async function getRandomWord(setGeneratedWord, generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord) {
    console.log("getting random word.")
    if (generatedWordsArr.length === 0) {
        // const newRandomWords = await generateRandomWords()
        const newRandomWords = [
                    "abrumador",
                    "efímero",
                    "escéptico",
                    "imperturbable",
                    "enigmático",
                    "despilfarro",
                    "insólito",
                    "desolación",
                    "arrebatar"
                  ]
        await setGeneratedWordsArr(newRandomWords)
        console.log(generatedWordsArr)
    }

    setTriggerNewRandomWord(true)

}

function LinguaGenerateRandom( {setGeneratedWord} ) {
    const [generatedWordsArr, setGeneratedWordsArr] = React.useState([])
    const [triggerNewRandomWord, setTriggerNewRandomWord] = React.useState(false)
    // const generatedStr = `
    // Word 1: abrumador
    // Word 2: efímero
    // Word 3: escéptico
    // Word 4: imperturbable
    // Word 5: enigmático
    // Word 6: despilfarro
    // Word 7: insólito
    // Word 8: desolación
    // Word 9: arrebatar
    // `

    React.useEffect(() => {
        if (!triggerNewRandomWord || generatedWordsArr.length === 0) { return }
        setTriggerNewRandomWord(false)

        const firstWord = generatedWordsArr[0]
        setGeneratedWordsArr(generatedWordsArr.slice(1, generatedWordsArr.length-1))
        // console.log(`generatedWordsArr: ${generatedWordsArr}`)
        setGeneratedWord(firstWord)
    }, [triggerNewRandomWord])

    return (
        <div className="ll-generate-random-container">
            <button 
                className="submit-btn ll-btn ll-generate-random-btn"
                onClick={() => getRandomWord(setGeneratedWord, generatedWordsArr, setGeneratedWordsArr, setTriggerNewRandomWord)}
                >
                    Generate Word
            </button>
        </div>
    )
}

export default LinguaGenerateRandom
