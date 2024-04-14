import React from 'react';
import logo from '../recursos/logodecel.png';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './style.css';

export default function Cabecalho(props) {
    return (
        <Navbar expand="lg" variant="light" bg="light" className="custom-navbar">
            <Navbar.Brand as={NavLink} to="/" className="brandLogo mr-auto">
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
                    <NavLink exact to="/menu" className="nav-link">Início</NavLink>
                    <NavLink to="/veiculos" className="nav-link">Veículos</NavLink>
                    <NavLink to="/alunos" className="nav-link">Alunos</NavLink>
                    <NavLink to="/responsaveis" className="nav-link">Responsáveis</NavLink>
                    <NavLink to="/escolas" className="nav-link">Escolas</NavLink>
                    <NavLink to="/pontos-embarque" className="nav-link">Pontos de Embarque</NavLink>
                    <NavLink to="/motorista" className="nav-link">Motoristas</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
