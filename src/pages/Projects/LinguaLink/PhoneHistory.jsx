import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import LinguaHistoryContent from './LinguaHistoryContent'
import './PhoneHistory.css'

function PhoneHistory( {history, setCurrentWord, numHistoryClicks, setNumHistoryClicks,currentWordIndex, setCurrentWordIndex } ) {
    const [showHistory, setShowHistory] = React.useState(false);
    const handleCloseHistory = () => setShowHistory(false);
    const handleShowHistory = () => setShowHistory(true);
    return (
        <div>
            <FontAwesomeIcon className="ll-book-icon" icon={faBook} onClick={handleShowHistory} />
            <Modal show={showHistory} onHide={handleCloseHistory}>
                <Modal.Header closeButton>
                <Modal.Title className="ll-phone-history-title">HISTORY</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ll-phone-history-modal-body">
                <LinguaHistoryContent history={history} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks}
                                        setNumHistoryClicks={setNumHistoryClicks} currentWordIndex={currentWordIndex} 
                                        setCurrentWordIndex={setCurrentWordIndex} />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseHistory} className="ll-phone-history-close-btn">
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PhoneHistory
