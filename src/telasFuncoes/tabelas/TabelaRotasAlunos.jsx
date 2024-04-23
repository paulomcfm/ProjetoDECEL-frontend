import { useState, useEffect } from 'react';
import React from 'react';
import { Container, Form, Table, Card, Button, Col, Row, Dropdown } from 'react-bootstrap';
import '../../templates/style.css';
import { useSelector, useDispatch } from 'react-redux';
// import { buscarMotoristas } from '../../redux/motoristaReducer';
// import { buscarRotas } from '../../redux/rotaReducer';
// import { buscarPontosEmbarque } from '../../redux/pontosEmbarqueReducer';

export default function TabelaRotasAlunos(props) {
    const { estado, mensagem, rotas } = useSelector(state => state.rota);
    const [termoBusca, setTermoBusca] = useState('');
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(buscarRotas());
    // }, [dispatch]);

    const rota1 = {
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
    
    const rota2 = {
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
    
    const rota3 = {
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
    
    const listaRotas = [rota1, rota2, rota3];
    
    const rotaVazia = {
        nome: '',
        km: '',
        periodo: '',
        tempoInicio: '',
        tempoFinal: '',
        motorista: {
            nome: '',
            cnh: '',
            celular: ''
        },
        monitor: {
            nome: '',
            cnh: '',
            celular: ''
        },
        veiculo: {
            placa: '',
            renavam: '',
            modelo: '',
            capacidade: '',
            tipo: ''
        },
        pontosDeEmbarque: [],
        inscricoes: []
    }

    // function editarRota(rota) {
    //     dispatch(buscarMotoristas(rota.motorista.codigo)).then((retorno) => {
    //         if (retorno.payload.status) {  
    //             props.setRotaParaEdicao(rota);
    //             props.setModoEdicao(true);
    //             props.exibirFormulario(true);
    //         }
    //     });
    // }

    return (
        <Container className="mt-4 mb-4 text-center">
            <h2>Rotas</h2>
            <Form>
                <Form.Group className="mb-3" controlId="selecionarRota">
                    <Form.Label>Busque a rota:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Busque uma rota"
                        id="rota"
                        name="rota"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </Form.Group>
            </Form>
            {rotas && rotas.length > 0 && (
                <div>
                    {rotas.map((rota, index) => (
                        <Table key={index} striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>KM</th>
                                    <th>Período</th>
                                    <th>Tempo Início</th>
                                    <th>Tempo Final</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{rota.nome}</td>
                                    <td>{rota.km}</td>
                                    <td>{rota.periodo}</td>
                                    <td>{rota.tempoInicio}</td>
                                    <td>{rota.tempoFinal}</td>
                                </tr>
                            </tbody>
                        </Table>
                    ))}
                </div>
            )}
            <Button
                type="button"
                className="d-flex align-items-center mb-4 mt-2 mx-auto"
                style={{ width: '142px' }}
                onClick={() => {
                    props.setRotaParaEdicao(rotaVazia);
                    props.exibirFormulario(true);
                }}
            >
                Cadastrar Aluno
            </Button>
        </Container>
    );
}
