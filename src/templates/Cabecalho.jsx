import React from 'react';
import logo from '../recursos/logodecel.png';
import user from '../recursos/avatarPadrao.png'
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './style.css';

export default function Cabecalho(props) {
    return (
        <Navbar expand="lg" variant="light" bg="light" className="custom-navbar">
            <Navbar.Brand as={NavLink} to="/menu" className="brandLogo mr-auto">
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
                    <NavLink to="/cadastro-user" className="nav-link">Usuarios</NavLink>
                </Nav>
            </Navbar.Collapse>
            <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                    <img
                        src={user}
                        alt="Imagem Usuário"
                        className="img-fluid"
                        style={{ maxHeight: '40px', cursor: 'pointer' , marginRight: '83px'}}
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Editar Usuário</Dropdown.Item>
                    <NavLink to="/" className="dropdown-item nav-link" style={{ textAlign: 'center' }}>Sair</NavLink>
                </Dropdown.Menu>
            </Dropdown>
        </Navbar>
    );
}