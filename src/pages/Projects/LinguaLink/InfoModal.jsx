import React from 'react'
import './InfoModal.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import frogPhoto from './pics/frog_in_rain.png'
import main_logo from './pics/main_logo.png'

function InfoModal( {show1, setShow1} ) {
    const [show2, setShow2] = React.useState(false)
    const [show3, setShow3] = React.useState(false)
    const [ranaCounter, setRanaCounter] = React.useState(0)

    const ranaTexts = [
        <span>rana</span>,
        <span>{"-->"}</span>,
        <span>rain</span>,
        <span>{"-->"}</span>,
        <img src={frogPhoto} alt="frog in rain" className="ll-frog-photo" />,
        <span>{"-->"}</span>,
        <span>frog</span>
    ]

    const handleShow2 = () => {
        setShow1(false)
        setShow2(true)
    }
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const handleClose2 = () => setShow2(false)
    function handleBackTo1() {
        setShow2(false)
        setShow1(true)
    }
    function handleShow3() {
        setShow2(false)
        setShow3(true)
    }
    const handleClose3 = () => setShow3(false)
    function handleBackTo2() {
        setShow3(false)
        setShow2(true)
    }

    React.useEffect(() => {
        if (show3) {
            const timer = setTimeout(() => {
                setRanaCounter((prevCount) => (prevCount + 1) % (ranaTexts.length + 1));
              }, 1000);
          
            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [show3, ranaCounter])

    return (
        <div className='ll-info-modal'>
            <button 
                className="submit-btn ll-btn ll-info-modal-btn"
                onClick={handleShow1}>
                    How It Works
            </button>
            <Modal
                show={show1}
                onHide={handleClose1}
                size='lg'
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <div className="ll-modal-header-container">
                        <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
                        <Modal.Title className="ll-info-modal-title">HOW IT WORKS</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body className="ll-info-modal-body">
                    <p>
                        <span className="ll-bold">Welcome to Lingua Link!</span> Elevate your language learning experience to new heights through the fusion of 
                        powerful memory techniques with cutting-edge AI technology.
                    </p>
                    <p>
                        <span className="ll-bold">Mnemonics</span> are invaluable memory aids for enhancing information recall. However, crafting effective mnemonics 
                        can be time-consuming and challenging. That's where Lingua Link comes in, offering a seamless solution. Our 
                        app effortlessly generates impactful mnemonics, freeing you from the arduous task of devising them yourself.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShow2} className='ll-info-modal-continue-btn'>
                        Next
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
                    <div className="ll-modal-header-container">
                        <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
                        <Modal.Title className="ll-info-modal-title">HOW IT WORKS</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body className="ll-info-modal-body">
                    <p>
                        <span className="ll-bold">Here's how it works: </span>Picture yourself with a word and its corresponding definition that you want to remember. 
                        To firmly imprint that definition into your long-term memory, establish a connection with something familiar 
                        in the form of a mental image. The goal is to create a key—a powerful association that links the vocabulary 
                        word and the visual representation. A well-crafted key cleverly intertwines with the word, ensuring its 
                        unforgettable presence in your memory.
                    </p>
                    <p>
                        This process utilizes two memory techniques known as <span className="ll-bold">Elaborative Encoding </span>  
                        and <span className="ll-bold">Linkword Mnemonics</span>. <span className="ll-bold">Elaborative Encoding </span> 
                        strengthens memory consolidation and retrieval by connecting new information to existing knowledge, 
                        such as in the form of a mental image. <span className="ll-bold">Linkword Mnemonics</span> creates associations 
                        between words, facilitating memory recall.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleBackTo1} className='ll-info-modal-continue-btn'>
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleShow3} className='ll-info-modal-continue-btn'>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={show3}
                onHide={handleClose3}
                size='lg'
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <div className="ll-modal-header-container">
                        <img src={main_logo} alt="lingua link logo" className='ll-modal-header-logo' />
                        <Modal.Title className="ll-info-modal-title">HOW IT WORKS</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body className="ll-info-modal-body">
                    <p>
                        <span className="ll-bold">Let's take a concrete example: </span>Imagine you're learning the Spanish word "rana," meaning "frog." A simple 
                        mnemonic or key is the word "rain." The resemblance between "rana" and "rain" makes it easy to remember. 
                        When you recall the association with rain, an image of a frog under a rain cloud materializes in your 
                        mind, helping you quickly recall the definition.
                    </p>
                    <div className="rana-example">
                        {ranaTexts.map((text, index) => (
                            <span key={index}>{ranaCounter > index ? text : <span></span>}</span>
                        ))}
                    </div>
                    <p>
                        Lingua Link empowers you to find your fluency and unlock the full potential of your language learning 
                        capabilities. Click <span className="ll-bold">Continue</span> to get started!
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleBackTo2} className='ll-info-modal-continue-btn'>
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleClose3} className='ll-info-modal-continue-btn'>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default InfoModal
