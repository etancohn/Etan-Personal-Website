import React from 'react'
import '../global.css'
import './DarkGreenButton.css'
import { useNavigate, redirect } from "react-router-dom"

export default function DarkGreenButton(
    { text = '<Text>', width='auto', height='auto', padding='1rem 2rem', fontSize='1rem' }) {
        
    const navigate = useNavigate()

    const buttonStyle = {
        width: width,
        height: height,
        padding: padding,
        fontSize: fontSize
    }
    return (
        <button className="dark-green-btn" style={buttonStyle} onClick={() => navigate("/pages/under-construction")}>
        {/* // <button className="dark-green-btn" style={buttonStyle} onClick={() => redirect(`/components/under-construction`)}> */}
            <span className="btn-txt">{text}</span>
        </button>
    )
}