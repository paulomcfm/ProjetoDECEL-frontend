import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Pagina from '../templates/Pagina';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import imagemDefinirRota from '../recursos/cinza.png';
import imagemAlocarAluno from '../recursos/preto.png';
import imagemInscreverAluno from '../recursos/rosa.jpg';
import imagemRegistrarManutencao from '../recursos/verde.jpg';
import '../templates/style.css';

export default function Menu(props) {
    return (
        <Pagina>
            <Container fluid className="mt-4">
                <Row className="justify-content-center">
                    <Col xs={12} className="mb-4 text-center">
                        <h2>Bem-vindo ao Sistema de Gerenciamento</h2>
                        <p>
                            Este sistema permite que você faça várias operações importantes, como definir rotas, inscrever alunos, alocar alunos e registrar manutenções.
                        </p>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={6} md={3} lg={3} className="mb-3 p-0">
                        <NavLink to="/definir-rota" className="nav-link">
                            <img src={imagemDefinirRota} alt="Definir Rota" className="imagem-botao w-100 hover-scale" />
                        </NavLink>
                    </Col>
                    <Col xs={6} md={3} lg={3} className="mb-3 p-0">
                        <NavLink to="/inscricao-aluno" className="nav-link">
                            <img src={imagemRegistrarManutencao} alt="Inscrever Aluno" className="imagem-botao w-100 hover-scale" />
                        </NavLink>
                    </Col>
                    <Col xs={6} md={3} lg={3} className="mb-3 p-0">
                        <NavLink to="/alocar-aluno" className="nav-link">
                            <img src={imagemDefinirRota} alt="Alocar Aluno" className="imagem-botao w-100 hover-scale" />
                        </NavLink>
                    </Col>
                    <Col xs={6} md={3} lg={3} className="mb-3 p-0">
                        <NavLink to="/registrar-manutencao" className="nav-link">
                            <img src={imagemRegistrarManutencao} alt="Registrar Manutenção" className="imagem-botao w-100 hover-scale" />
                        </NavLink>
                    </Col>
                </Row>
            </Container>
        </Pagina>
    );
}
