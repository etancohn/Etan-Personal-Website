import React from 'react'
import './InfoModal.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function InfoModal() {
    const [show1, setShow1] = React.useState(false);
    const [show2, setShow2] = React.useState(false);

    const handleShow2 = () => {
        setShow1(false)
        setShow2(true)
    }
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const handleClose2 = () => setShow2(false);

    return (
        <div className='ll-info-modal'>
            <button 
                className="submit-btn ll-btn ll-info-modal-btn"
                onClick={handleShow1}>
                    Why It Works
            </button>
            <Modal
                show={show1}
                onHide={handleClose1}
                size='lg'
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="ll-info-modal-title">WHY IT WORKS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Modal 1.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShow2} className='ll-info-modal-continue-btn'>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={show2}
                onHide={handleClose2}
                size='lg'
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="ll-info-modal-title">WHY IT WORKS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Modal 2.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose2} className='ll-info-modal-continue-btn'>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default InfoModal
