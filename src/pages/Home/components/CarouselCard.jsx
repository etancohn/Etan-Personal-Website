import React from 'react'
import './CarouselCard.css'
import { useNavigate } from "react-router-dom"

export default function CarouselCard(
    { img = "(IMG)", title = "Title", description = "Description.", width = "auto", height = "auto",
    link = "/pages/under-construction" }) {

    let navigate = useNavigate()
    
    const carouselCardStyle = {
        width: width,
        height: height
    }
    
    return (
        <div className="carousel-card" style={carouselCardStyle}>
            {/* <div className="card-img">{img}</div> */}
            <h4 className="card-title">{title}</h4>
            <p className="card-description">{description}</p>
            <button className="card-btn" onClick={() => navigate(link)}>Link</button>
        </div>
    )
}