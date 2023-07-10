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
                <Modal.Body className="ll-info-modal-body">
                    <p className='ll-info-modal-scenario'>
                        <span className='ll-bolded'>Scenario - </span>
                        You come across a vocabulary word that looks familiar to you. In fact, maybe it was on a flash card 
                        you reviewed multiple times the previous day. Unfortunately, no matter how hard you try, you can’t seem to remember 
                        what that word means. You are left feeling lost within your own brain, searching hopelessly for a word that you are 
                        confident exists SOMEWHERE inside your brain.
                    </p>
                    <p>
                        <span className="ll-bolded">Linkword Mnemonics</span> is a proven technique that creates associations between words, making them easier to 
                        remember. By forming mental links or connections between the words you want to remember and familiar words or 
                        images, you enhance your ability to recall the information later on. It's like creating a key that unlocks 
                        the desired mental image.
                    </p>
                    <p>
                        <span className="ll-bolded">Elaborative Encoding,</span> on the other hand, actively engages your mind by connecting new information to existing 
                        knowledge. It involves deep processing and meaningful associations, whether through personal experiences, emotions, 
                        or forming mental images and stories. This technique strengthens memory consolidation and retrieval.
                    </p>
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
                <Modal.Body className="ll-info-modal-body">
                    <p>
                        Here's a helpful perspective: Picture yourself with a word and its definition that you want to remember. 
                        To store that definition in your long-term memory, you can forge a connection between it and something familiar 
                        to you, like a memory or mental image. The goal is to create a key that unlocks that mental image—an association 
                        linking the vocabulary word and the mental image. An effective key is one that is cleverly embedded within the 
                        vocabulary word, ensuring you won't easily forget it.
                    </p>
                    <p>
                        Our app harnesses the power of AI technology to simplify and streamline the process. Say goodbye to the 
                        time-consuming task of thinking up connections—our app does it for you, ensuring you get the absolute best out of 
                        these memory strategies. It's time to unlock the potential of your memory and elevate your learning experience. 
                        Try it today and embark on a memorable journey of language acquisition.
                    </p>
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
