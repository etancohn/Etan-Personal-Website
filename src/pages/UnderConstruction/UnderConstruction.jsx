import React from 'react'
import "./UnderConstruction.css"
import { useNavigate } from "react-router-dom"
import GreenNavbar from "../../components/GreenNavbar.jsx"

export default function UnderConstruction() {
    let navigate = useNavigate()
    return (
        <div className="under-construction">
            <GreenNavbar />
            <div className="construction-text">
                <p>This Page Is Under Construction...</p>
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                        navigate(-1)
                    }}
                    >Go Back
                </button>
            </div>
        </div>
    )
}