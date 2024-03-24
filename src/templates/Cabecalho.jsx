import React from 'react';
import logo from '../recursos/logodecel.png';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './style.css';

export default function Cabecalho(props){
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand as={Link} to="/" className="brandLogo mr-auto">
                    <img
                        src={logo} 
                        alt="Logo DECEL"
                        className="img-fluid"
                        style={{ maxHeight: '60px' }}
                    />
                    Transporte DECEL
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarNav" />
            <Container >
                <Navbar.Collapse id="navbarNav">
                    <Nav className="ml-auto">
                        <NavDropdown title="Veículos" id="veiculosDropdown" className="custom-dropdown">
                            <NavDropdown.Item href="#">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Alterar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Excluir</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Alunos" id="alunosDropdown">
                            <NavDropdown.Item as={Link} to="/alunos">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Alterar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Excluir</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Responsáveis" id="responsaveisDropdown">
                            <NavDropdown.Item as={Link} to="/responsaveis">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Alterar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Excluir</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Escolas" id="escolasDropdown">
                            <NavDropdown.Item as={Link} to="/escolas">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Alterar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Excluir</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Pontos de Embarque" id="pontosDropdown">
                            <NavDropdown.Item href="#">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Alterar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Excluir</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Motoristas" id="motoristasDropdown">
                            <NavDropdown.Item href="#">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Alterar</NavDropdown.Item>
                            <NavDropdown.Item href="#">Excluir</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
