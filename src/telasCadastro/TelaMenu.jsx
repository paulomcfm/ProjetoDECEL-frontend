import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Pagina from '../templates/Pagina';
import { NavLink } from 'react-router-dom';
import '../templates/style.css';
import { TfiWrite } from "react-icons/tfi";
import { FaRoute, FaBus, FaTools } from "react-icons/fa";

export default function Menu(props) {
    return (
        <div className="background-image">
            <Pagina>
                <Container className="custom-container shadow-lg p-4 rounded text-center" style={{ marginTop: '40px' }}>
                    <Row className="justify-content-center">
                        <Col xs={12} className="mb-4 text-center">
                            <h2>Bem-vindo ao Sistema de Gerenciamento DECEL</h2>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={6} md={3} lg={3} className="p-1">
                            <div className="imagem-botao w-100 hover-scale rounded shadow">
                                <NavLink to="/definir-rota" className="nav-link">
                                    <FaRoute style={{ width: '50%', height: '50%', marginTop: '40px' }} />
                                    <p style={{ fontSize: '30px', marginTop: '40px', marginBottom: '20px' }}>Definir Rota</p>
                                </NavLink>
                            </div>
                        </Col>
                        <Col xs={6} md={3} lg={3} className="p-1">
                            <div className="imagem-botao w-100 hover-scale rounded shadow">
                                <NavLink to="/inscricao-aluno" className="nav-link">
                                    <TfiWrite style={{ width: '50%', height: '50%', marginTop: '40px' }} />
                                    <p style={{ fontSize: '30px', marginTop: '40px', marginBottom: '20px' }}>Inscrever Aluno</p>
                                </NavLink>
                            </div>
                        </Col>
                        <Col xs={6} md={3} lg={3} className="p-1">
                            <div className="imagem-botao w-100 hover-scale rounded shadow">
                                <NavLink to="/alocar-aluno" className="nav-link">
                                    <FaBus style={{ width: '50%', height: '50%', marginTop: '40px' }} />
                                    <p style={{ fontSize: '30px', marginTop: '40px', marginBottom: '20px' }}>Alocar Alunos</p>
                                </NavLink>
                            </div>
                        </Col>
                        <Col xs={6} md={3} lg={3} className="p-1">
                            <div className="imagem-botao w-100 hover-scale rounded shadow">
                                <NavLink to="/registrar-manutencao" className="nav-link">
                                    <FaTools style={{ width: '50%', height: '50%', marginTop: '40px' }} />
                                    <p style={{ fontSize: '30px', marginTop: '40px', marginBottom: '20px' }}>Registrar Manutenção</p>
                                </NavLink>
                            </div>
                        </Col>
                    </Row>
                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                        <NavLink to="/registrar-manutencao" className="nav-link" style={{ width: '40%', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="imagem-botao w-100 hover-scale rounded shadow" style={{ backgroundColor: 'rgba(8, 8, 87, 0.886)', color: 'white', justifyContent: 'center' }}>
                                <p style={{ fontSize: '30px' }}>Relatórios</p>
                            </div>
                        </NavLink>
                    </div>
                </Container>
            </Pagina>
        </div>
    );
}
