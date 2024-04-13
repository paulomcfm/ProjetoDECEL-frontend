import { useState, useEffect } from 'react';
import React from 'react';
import Pagina from '../templates/Pagina';
import { Container, Form, Card, Button, Col, Row, Dropdown } from 'react-bootstrap';
import '../templates/style.css';

export default function TelaAlocarAluno(props) {
    const [rotaSelecionada, setRotaSelecionada] = useState(null);

    const handleSelecionarRota = (rota) => {
        setRotaSelecionada(rota);
    };

    return (
        <Pagina>
            <Container className="mt-4 mb-4 text-center">
                <h2>Alocar Aluno</h2>
                <Form>
                    <Form.Group className="mb-3" controlId="selecionarRota">
                        <Form.Label>Selecione a rota:</Form.Label>
                        <Form.Select>
                            <option value="">Selecione...</option>
                            <option value="Rota 1">Rota 1 - Motorista A - ABC-1234 - Escolas X, Y, Z</option>
                            <option value="Rota 2">Rota 2 - Motorista B - DEF-5678 - Escolas P, Q, R</option>
                        </Form.Select>
                    </Form.Group>
                    {/* Adicione mais campos de formulário conforme necessário */}
                </Form>
                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Rota 2</Card.Title>
                        <Card.Text>
                            <strong>Motorista:</strong> Motorista B<br />
                            <strong>Placa do Veículo:</strong> ABC-1234<br />
                            <strong>Escolas de Destino:</strong> Escolas P, Q, R<br />
                            <strong>Pontos de Embarque:</strong> Rua X, Avenida Y, Praça Z
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Form.Label className="mt-4">Alunos:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Busque um aluno"
                    id="responsavel"
                    name="responsavel"
                    value={''}
                />
                <div className="d-flex justify-content-center align-items-center">
                    <Button
                        variant="light"
                        className="me-2 mb-2 mt-4"
                    >
                        {`${'Aluno 1'} - RG: ${'123.456.78-7'}`}
                    </Button>
                    <Button
                        variant="danger"
                        className="mb-2 mt-4"
                    >
                        Remover
                    </Button>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <Button
                        variant="light"
                        className="me-2 mb-2 mt-4"
                    >
                        {`${'Aluno 2'} - RG: ${'222.222.78-7'}`}
                    </Button>
                    <Button
                        variant="danger"
                        className="mb-2 mt-4"
                    >
                        Remover
                    </Button>
                </div>
                <Button className="mt-4" variant="primary" onClick={() => { }}>Alocar Alunos</Button>

                <div className="result-list">
                    {/* Aqui você pode adicionar a lista de resultados da busca de alunos */}
                </div>
                <div className="alocacao-info">
                    {/* Aqui você pode adicionar o retângulo de alocação */}
                </div>
            </Container>
        </Pagina>
    );
}
