import { useState, useEffect } from 'react';
import React from 'react';
import { Container, Form, Card, Button, Col, Row, Dropdown } from 'react-bootstrap';
import '../templates/style.css';
import Pagina from "../templates/Pagina";

export default function TelaAlocarAluno(props) {
    const [rotaSelecionada, setRotaSelecionada] = useState(null);
    const [rotaEstaSelecionada, setRotaEstaSelecionada] = useState(false);

    var rota1 = {
        nome: 'Rota 1',
        km: '10',
        periodo: 'Matutino',
        tempoInicio: '08:00',
        tempoFinal: '12:00',
        motorista: {
            nome: 'João da Silva',
            cnh: '123456789',
            celular: '9999-9999'
        },
        monitor: {
            nome: 'Maria Oliveira',
            cnh: '987654321',
            celular: '8888-8888'
        },
        veiculo: {
            placa: 'ABC-1234',
            renavam: '123456789',
            modelo: 'Fiat Uno',
            capacidade: '5',
            tipo: 'Micro-ônibus'
        },
        pontosDeEmbarque: [
            { rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
            { rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
        ],
        inscricoes: [
            { nome: 'Aluno 1', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
            { nome: 'Aluno 2', rg: '2345678', dataNasc: '2001-02-02', celular: '2222-2222', observacoes: 'Observações do Aluno 2' }
        ]
    };

    var rota2 = {
        nome: 'Rota 2',
        km: '15',
        periodo: 'Vespertino',
        tempoInicio: '13:00',
        tempoFinal: '17:00',
        motorista: {
            nome: 'Pedro Oliveira',
            cnh: '987654321',
            celular: '8888-8888'
        },
        monitor: {
            nome: 'Ana da Silva',
            cnh: '123456789',
            celular: '9999-9999'
        },
        veiculo: {
            placa: 'XYZ-9876',
            renavam: '987654321',
            modelo: 'Volkswagen Gol',
            capacidade: '4',
            tipo: 'Van'
        },
        pontosDeEmbarque: [
            { rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
            { rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
        ],
        inscricoes: [
            { nome: 'Aluno 1', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
            { nome: 'Aluno 2', rg: '2345678', dataNasc: '2001-02-02', celular: '2222-2222', observacoes: 'Observações do Aluno 2' }
        ]
    };

    var rota3 = {
        nome: 'Rota 3',
        km: '20',
        periodo: 'Noturno',
        tempoInicio: '18:00',
        tempoFinal: '22:00',
        motorista: {
            nome: 'Carlos Santos',
            cnh: '456789123',
            celular: '7777-7777'
        },
        monitor: {
            nome: 'Fernanda Lima',
            cnh: '789123456',
            celular: '6666-6666'
        },
        veiculo: {
            placa: 'DEF-5678',
            renavam: '456789123',
            modelo: 'Chevrolet Onix',
            capacidade: '4',
            tipo: 'Carro'
        },
        pontosDeEmbarque: [
            { rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
            { rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
        ],
        inscricoes: [
            { nome: 'Aluno 1', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
            { nome: 'Aluno 2', rg: '2345678', dataNasc: '2001-02-02', celular: '2222-2222', observacoes: 'Observações do Aluno 2' }
        ]
    };

    var listaRotas = [rota1, rota2, rota3];
    const handleSelecionarRota = (rota) => {
        setRotaSelecionada(rota);
        setRotaEstaSelecionada(true);
    };

    return (
        <Pagina>
            <Container className="mt-4 mb-4 text-center">
                <h2>Alocar Aluno</h2>
                <Form.Group className="mb-3" controlId="selecionarRota">
                    <Form.Label>Selecione a rota:</Form.Label>
                    <Form.Select onChange={(e) => handleSelecionarRota(e.target.value)}>
                        <option value="">Selecione...</option>
                        {listaRotas.map((rota, index) => (
                            <option key={index} value={rota.nome}>{rota.nome}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                {rotaEstaSelecionada && rotaSelecionada && (
                    <>
                        <Card className="mt-4">
                            <Card.Body>
                                <Card.Title>{rotaSelecionada.nome}</Card.Title>
                                <Card.Text>
                                    <strong>Motorista:</strong> {rotaSelecionada.motorista.nome}<br />
                                    <strong>Placa do Veículo:</strong> {rotaSelecionada.veiculo.placa}<br />
                                    {/* Adicione mais campos conforme necessário */}
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
                    </>
                )}

            </Container>
        </Pagina>
    );
}