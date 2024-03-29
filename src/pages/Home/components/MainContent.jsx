
import React from 'react'
import '../../../global.css'
import DarkGreenButton from '../../../components/DarkGreenButton.jsx'
import Carousel from 'react-bootstrap/Carousel'
import CarouselCard from './CarouselCard.jsx'
import { websitesData } from '../../../data/website-data.js'
import etanGradPhoto from '../../../pics/etan-grad-photo.png'


export default function MainContent() {
    
    const [L, setL] = React.useState([])
    const [numCards, setNumCards] = React.useState(3)  // num of carousel cards displayed at one time

    // Change how many carousel cards are displayed when screen size changes
    const handleResize = () => {
        setNumCards(3)
        if (window.innerWidth < 950) {
            setNumCards(2)
        } 
        if (window.innerWidth < 775) {
            setNumCards(1)
        }
    }

    // Listen for window resize event
    React.useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    })


    // Create carousel cards for each website
    React.useEffect(() => {
        setL([])
        websitesData.forEach((website, i) => {
            if (i % numCards === 0) {
                setL(prevL => [...prevL, []])
            }
            setL((prevL) => {
                let updatedL = [...prevL]
                const websiteCard = 
                    <CarouselCard 
                    title={website.title} 
                    description={website.description} 
                    link={website.link}
                    key={i} />
                updatedL[updatedL.length - 1] = [...updatedL[updatedL.length - 1], websiteCard]
                return updatedL
            }) 
        })
    }, [numCards])

    return (
        <div className="homepage-main-content-container">

            {/* Picture and Title */}
            <img src={etanGradPhoto} alt="A picture of Etan Cohn." className="etan-grad-photo" />
            <h1 className="etan-cohn-title">ETAN COHN</h1>
            <p className="etan-description-text">
                Welcome to my personal website! Check out my resume and some web app projects below.
            </p>

            {/* Resumes */}
            <div className="resume-btns">
                <DarkGreenButton text="Software Resume" width="10rem" url="pages/software-resume" />
                <DarkGreenButton text="Music Resume" width="10rem" url="pages/music" />
            </div>

            {/* Line Separation */}
            <p className="horizontal-line"></p>

            {/* Projects carousel */}
            <div className="website-carousel">
                <Carousel 
                    variant='dark' 
                    indicators={false}
                    interval={25000}
                    >
                        {L.map((carouselCardRow, index) => (
                            <Carousel.Item key={index}>
                                <div className="carousel-row">
                                    {carouselCardRow}
                                </div>
                            </Carousel.Item>)

                        )}
                </Carousel>
            </div>

            {/* Projects button */}
            <DarkGreenButton text="Projects" width="35%" url="pages/projects-page" />
            <div className="bottom"></div>
            
        </div>
    )
}