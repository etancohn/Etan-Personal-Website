import React from 'react'
import './CarouselCard.css'
import { useNavigate } from "react-router-dom"

export default function CarouselCard(
    { img = "(IMG)", title = "Title", description = "Description.",
    link = "/pages/under-construction" }) {

    let navigate = useNavigate()
    
    return (
        <div className="carousel-card">
            {/* <h4 className="card-title">{title}</h4> */}
            {/* <p className="card-description">{description}</p> */}
            <div className="carousel-card-title-and-description">
                <h4 className="carousel-card-title">{title}</h4>
                <p className="carousel-card-description">{description}</p>
            </div>
            <div className="carousel-card-btn-wrapper">
                <button className="carousel-card-btn" onClick={() => navigate(link)}>Link</button>
            </div>
        </div>
    )
}