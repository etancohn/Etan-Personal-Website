import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import main_logo from './pics/main_logo.png'
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import './ExtraMnemonicsModal.css'

function ExtraMnemonicsModal( {displayExtraMnemonics, setDisplayExtraMnemonics, extraMnemonicsLoading, currentWord,
                            extraMnemonics} ) {
  return (
    <div>
        <Modal
            show={displayExtraMnemonics}
            onHide={() => setDisplayExtraMnemonics(false)}
            size='lg'
            backdrop="static"
            keyboard={false}
            className="ll-modals"
        >
            <Modal.Header closeButton>
                <div className="ll-modal-header-container">
                    <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
                    <Modal.Title className="ll-info-modal-title">EXTRA MNEMONICS</Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body className="ll-info-modal-body">
                <div className="ll-extra-mnemonics-word-info">
                    <div><span className="ll-bold">Word - </span>{currentWord.word}</div>
                    <div><span className="ll-bold">Translantion - </span>{currentWord.translation}</div>
                </div>
                <Table bordered hover size="lg" striped 
                className={`ll-extra-mnemonics-tbl-loading-${extraMnemonicsLoading}`}
                >
                    <thead className="ll-modal-tbl-header">
                        <tr className={`ll-extra-mnemonics-tbl-loading-${extraMnemonicsLoading}`}>
                            <td>Mnemonic</td>
                            <td>Mental Image</td>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        extraMnemonics.map((extraMnemonic, index) => (  
                            <tr key={index} className="ll-modal-tbl-row" 
                            >
                                <td>{extraMnemonic.mnemonic}</td>
                                <td>{extraMnemonic.mental_image}</td>
                            </tr>                         
                        ))
                    }
                    </tbody>
                </Table>
                <Spinner className={`ll-loading-spinner-${extraMnemonicsLoading}`} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => setDisplayExtraMnemonics(false)} className='ll-info-modal-continue-btn'>
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default ExtraMnemonicsModal
