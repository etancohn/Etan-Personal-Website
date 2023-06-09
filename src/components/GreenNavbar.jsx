import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./GreenNavbar.css"
import { useNavigate, redirect } from "react-router-dom";

export default function GreenNavbar() {
    const navigate = useNavigate()
  return (
    <nav>
        <Navbar collapseOnSelect expand="lg">
            <Navbar.Brand onClick={() => navigate("/")} className="erc-logo">
                <span className="logo-letter-e">E</span>
                <span className="logo-letter-r">R</span>
                <span className="logo-letter-c">C</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto nav-clickable-items">
                    <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                    <NavDropdown title="Resumes" id="collasible-nav-dropdown">
                        <NavDropdown.Item onClick={() => navigate("/pages/software-resume")}>Software Resume</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/pages/under-construction")}>Music Resume</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link onClick={() => navigate("/pages/under-construction")}>Projects</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </nav>
  )
}
