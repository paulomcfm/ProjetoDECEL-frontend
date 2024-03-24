import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import Pagina from '../templates/Pagina';
import '../templates/style.css';

export default function Menu(props) {
    return (
        <Pagina>
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col xs={12} className="mb-4 text-center">
                        <h2>Bem-vindo ao Sistema de Gerenciamento</h2>
                        <p>
                            Este sistema permite que você faça várias operações importantes, como definir rotas, inscrever alunos, alocar alunos e registrar manutenções.
                        </p>
                    </Col>
                    <Col xs={12} md={6} lg={3} className="mb-3">
                        <Button variant="primary" className="custom-btn btn-modern">
                            Definir Rota
                        </Button>
                    </Col>
                    <Col xs={12} md={6} lg={3} className="mb-3">
                        <Button variant="primary" className="custom-btn btn-modern">
                            Inscrever Aluno
                        </Button>
                    </Col>
                    <Col xs={12} md={6} lg={3} className="mb-3">
                        <Button variant="primary" className="custom-btn btn-modern">
                            Alocar Aluno
                        </Button>
                    </Col>
                    <Col xs={12} md={6} lg={3} className="mb-3">
                        <Button variant="primary" className="custom-btn btn-modern">
                            Registrar Manutenção
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Pagina>
    );
}
