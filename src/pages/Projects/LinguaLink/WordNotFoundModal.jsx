import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import main_logo from './pics/main_logo.png'
import Table from 'react-bootstrap/Table';
import './WordNotFoundModal.css'

function WordNotFoundModal( {vocabWord, setVocabWord, language, makeGPTCallWrapper, setCurrentWord, setTriggerGeneration1,
                            setTriggerBlank, setHistory, setCurrentWordIndex, showWordInvalidModal, setShowWordInvalidModal,
                            similarWords, setSimilarWords, setIsLoading} ) {
  return (
    <Modal
        show={showWordInvalidModal}
        onHide={() => setShowWordInvalidModal(false)}
        size='lg'
        backdrop="static"
        keyboard={false}
        className="ll-modals"
    >
        <Modal.Header closeButton>
            <div className="ll-modal-header-container">
                <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
                <Modal.Title className="ll-info-modal-title">WORD NOT FOUND</Modal.Title>
            </div>
        </Modal.Header>
        <Modal.Body className="ll-info-modal-body">
            <p>
                Word <span className="ll-bold">'{vocabWord}'</span> not found in {language}. If you meant one of the
                words below, click it to get a mnemonic:
            </p>
            <div>
                <Table bordered hover size="lg" striped>
                    <thead className="ll-modal-tbl-header">
                        <tr>
                            <td>Word</td>
                            <td>Translation</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        similarWords.map((word, index) => (  
                            <tr key={index} className="ll-modal-tbl-row" 
                            onClick={() => {
                                setShowWordInvalidModal(false)
                                setVocabWord(word.possible_word)
                                makeGPTCallWrapper(word.possible_word, setIsLoading, setCurrentWord, 
                                    setTriggerGeneration1, setTriggerBlank, setHistory, setCurrentWordIndex,
                                    language, setShowWordInvalidModal, setSimilarWords, word.possible_word_translation)
                                }
                            }
                            >
                                <td>{word.possible_word}</td>
                                <td>{word.possible_word_translation}</td>
                            </tr>                         
                        ))
                    }
                    </tbody>
                </Table>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={() => setShowWordInvalidModal(false)} className='ll-info-modal-continue-btn'>
                Continue
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default WordNotFoundModal
