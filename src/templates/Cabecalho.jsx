import React from 'react';
import logo from '../recursos/logodecel.png';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './style.css';

export default function Cabecalho(props) {
    return (
        <Navbar expand="lg" variant="light" bg="light">
            <Navbar.Brand as={Link} to="/" className="brandLogo mr-auto">
                <img
                    src={logo}
                    alt="Logo DECEL"
                    className="img-fluid"
                    style={{ maxHeight: '40px' }}
                />

            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/">Início</Nav.Link>
                    <Nav.Link href="#">Veículos</Nav.Link>
                    <Nav.Link as={Link} to="/alunos">Alunos</Nav.Link>
                    <Nav.Link as={Link} to="/responsaveis">Responsáveis</Nav.Link>
                    <Nav.Link as={Link} to="/escolas">Escolas</Nav.Link>
                    <Nav.Link href="#">Pontos de Embarque</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            
        </Navbar>
    );
}