
import React from 'react'
import '../../../global.css'
import DarkGreenButton from '../../../components/DarkGreenButton.jsx'
import Carousel from 'react-bootstrap/Carousel'
import CarouselCard from './CarouselCard.jsx'
import { websitesData } from '../../../data/website-data.js'
import etanGradPhoto from '../../../pics/etan-grad-photo.png'


export default function MainContent() {
    
    const [L, setL] = React.useState([])
    const [x, setX] = React.useState(3)

    const handleResize = () => {
        setX(3)
        if (window.innerWidth < 950) {
            setX(2)
        } 
        if (window.innerWidth < 775) {
            setX(1)
        }
        
    }
    
    React.useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    })


    React.useEffect(() => {
        setL([])
        websitesData.forEach((website, i) => {
            if (i % x === 0) {
                setL(prevL => [...prevL, []])
            }
            setL((prevL) => {
                let updatedL = [...prevL]
                const websiteCard = 
                    <CarouselCard width="10rem" height="10rem" 
                    title={website.title} 
                    description={website.description} 
                    link={website.link}
                    key={i} />
                updatedL[updatedL.length - 1] = [...updatedL[updatedL.length - 1], websiteCard]
                return updatedL
            }) 
        })
    }, [x])

    return (
        <div className="main-content-container">
            {/* <img src="/src/pics/etan.png" alt="A picture of Etan Cohn." className="etan-photo" /> */}
            {/* <span className="etan-photo"></span> */}
            <img src={etanGradPhoto} alt="A picture of Etan Cohn." className="etan-grad-photo" />
            {/* <div className="top-space"></div> */}
            <h1 className="etan-cohn-title">ETAN COHN</h1>
            <p className="etan-description-text">
                Welcome to my personal website! Check out some projects and my resumes below.
            </p>
            <div className="resume-btns">
                <DarkGreenButton text="Software Resume" width="10rem" url="pages/software-resume" />
                <DarkGreenButton text="Music Resume" width="10rem" />
            </div>
            <p className="horizontal-line"></p>

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

            {/* 'Projects' button */}
            <DarkGreenButton text="Projects" width="35%" url="pages/projects-page" />
            <div className="bottom"></div>
            
        </div>
    )
}