import { useState, useEffect } from 'react';
import React from 'react';
import { Container, Form, Table, OverlayTrigger, Popover, Modal, Button } from 'react-bootstrap';
import '../templates/style.css';
import Pagina from "../templates/Pagina";
import { GrContactInfo } from "react-icons/gr";



export default function TelaAlocarAluno(props) {
    const [rotaSelecionada, setRotaSelecionada] = useState(null);
    const [rotaEstaSelecionada, setRotaEstaSelecionada] = useState(false);
    const [inscricoesSelecionadas, setInscricoesSelecionadas] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [inscricoesFiltradas, setInscricoesFiltradas] = useState([]);
    const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
    const [novaRotaSelecionada, setNovaRotaSelecionada] = useState(null);


    var rota1 = {
        nome: 'Rota 1',
        km: '10',
        periodo: 'Matutino',
        tempoInicio: '08:00',
        tempoFinal: '12:00',
        motoristas: [{
            id: '  1',
            nome: 'João da Silva',
            cnh: '123456789',
            celular: '9999-9999'
        },
        {
            id: '  2',
            nome: 'Pedro Oliveira',
            cnh: '987654321',
            celular: '8888-8888'
        }],
        monitor: {
            codigo: '1',
            nome: 'Maria Oliveira',
            cnh: '987654321',
            celular: '8888-8888'
        },
        veiculo: {
            codigo: '1',
            placa: 'ABC-1234',
            renavam: '123456789',
            modelo: 'Fiat Uno',
            capacidade: '5',
            tipo: 'Micro-ônibus'
        },
        pontosDeEmbarque: [
            { codigo: '1', rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
            { codigo: '2', rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
        ],
        inscricoes: [
            {
                codigo: '1',
                ano: '2022',
                anoLetivo: '9',
                turma: 'A',
                etapa: 'f',
                periodo: 'm',
                dataAocacao: '2022-01-01',
                aluno:
                {
                    codigo: '1',
                    nome: 'Aluno 11',
                    rg: '1234567',
                    dataNasc: '2000-01-01',
                    celular: '1111-1111',
                    observacoes: 'Observacoes do Aluno 1'
                },
                escola:
                {
                    codigo: '1',
                    nome: 'Escola 1',
                    tipo: 'f',
                    email: 'zQkKs@example.com',
                    telefone: '1111-1111',
                    observacoes: 'Observacoes da Escola 1'
                },
                pontoDeEmbarque:
                {
                    codigo: '1',
                    rua: 'Rua 1',
                    bairro: 'Bairro 1',
                    numero: '123',
                    cep: '12345-678'
                }
            },
            {
                codigo: '2',
                ano: '2022',
                anoLetivo: '9',
                turma: 'A',
                etapa: 'f',
                periodo: 'm',
                dataAocacao: '2022-01-01',
                aluno:
                {
                    codigo: '2',
                    nome: 'Aluno 12',
                    rg: '1234567',
                    dataNasc: '2000-01-01',
                    celular: '1111-1111',
                    observacoes: 'Observacoes do Aluno 1'
                },
                escola:
                {
                    codigo: '1',
                    nome: 'Escola 1',
                    tipo: 'f',
                    email: 'zQkKs@example.com',
                    telefone: '1111-1111',
                    observacoes: 'Observacoes da Escola 1'
                },
                pontoDeEmbarque:
                {
                    codigo: '1',
                    rua: 'Rua 1',
                    bairro: 'Bairro 1',
                    numero: '123',
                    cep: '12345-678'
                }
            }
        ]
    };

    var rota2 = {
        nome: 'Rota 2',
        km: '15',
        periodo: 'Vespertino',
        tempoInicio: '13:00',
        tempoFinal: '17:00',
        motoristas: [{
            id: '2',
            nome: 'Pedro Oliveira',
            cnh: '987654321',
            celular: '8888-8888'
        }],
        monitor: {
            codigo: '1',
            nome: 'Ana da Silva',
            cnh: '123456789',
            celular: '9999-9999'
        },
        veiculo: {
            codigo: '1',
            placa: 'XYZ-9876',
            renavam: '987654321',
            modelo: 'Volkswagen Gol',
            capacidade: '4',
            tipo: 'Van'
        },
        pontosDeEmbarque: [
            { codigo: '1', rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
            { codigo: '2', rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
        ],
        inscricoes: [
            {
                codigo: '1',
                ano: '2022',
                anoLetivo: '9',
                turma: 'A',
                etapa: 'f',
                periodo: 'm',
                dataAocacao: '2022-01-01',
                aluno:
                {
                    codigo: '1',
                    nome: 'Aluno 13',
                    rg: '1234567',
                    dataNasc: '2000-01-01',
                    celular: '1111-1111',
                    observacoes: 'Observacoes do Aluno 1'
                },
                escola:
                {
                    codigo: '1',
                    nome: 'Escola 1',
                    tipo: 'f',
                    email: 'zQkKs@example.com',
                    telefone: '1111-1111',
                    observacoes: 'Observacoes da Escola 1'
                },
                pontoDeEmbarque:
                {
                    codigo: '1',
                    rua: 'Rua 1',
                    bairro: 'Bairro 1',
                    numero: '123',
                    cep: '12345-678'
                }
            },
            {
                codigo: '2',
                ano: '2022',
                anoLetivo: '9',
                turma: 'A',
                etapa: 'f',
                periodo: 'm',
                dataAocacao: '2022-01-01',
                aluno:
                {
                    codigo: '2',
                    nome: 'Aluno 14',
                    rg: '1234567',
                    dataNasc: '2000-01-01',
                    celular: '1111-1111',
                    observacoes: 'Observacoes do Aluno 1'
                },
                escola:
                {
                    codigo: '1',
                    nome: 'Escola 1',
                    tipo: 'f',
                    email: 'zQkKs@example.com',
                    telefone: '1111-1111',
                    observacoes: 'Observacoes da Escola 1'
                },
                pontoDeEmbarque:
                {
                    codigo: '1',
                    rua: 'Rua 1',
                    bairro: 'Bairro 1',
                    numero: '123',
                    cep: '12345-678'
                }
            }
        ]
    };

    var rota3 = {
        nome: 'Rota 3',
        km: '20',
        periodo: 'Noturno',
        tempoInicio: '18:00',
        tempoFinal: '22:00',
        motoristas: [{
            id: '1',
            nome: 'Carlos Santos',
            cnh: '456789123',
            celular: '7777-7777'
        }],
        monitor: {
            codigo: '1',
            nome: 'Fernanda Lima',
            cnh: '789123456',
            celular: '6666-6666'
        },
        veiculo: {
            codigo: '1',
            placa: 'DEF-5678',
            renavam: '456789123',
            modelo: 'Chevrolet Onix',
            capacidade: '4',
            tipo: 'Carro'
        },
        pontosDeEmbarque: [
            { codigo: '1', rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
            { codigo: '2', rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
        ],
        inscricoes: [
            {
                codigo: '1',
                ano: '2022',
                anoLetivo: '9',
                turma: 'A',
                etapa: 'f',
                periodo: 'm',
                dataAocacao: '2022-01-01',
                aluno:
                {
                    codigo: '1',
                    nome: 'Aluno 15',
                    rg: '1234567',
                    dataNasc: '2000-01-01',
                    celular: '1111-1111',
                    observacoes: 'Observacoes do Aluno 1'
                },
                escola:
                {
                    codigo: '1',
                    nome: 'Escola 1',
                    tipo: 'f',
                    email: 'zQkKs@example.com',
                    telefone: '1111-1111',
                    observacoes: 'Observacoes da Escola 1'
                },
                pontoDeEmbarque:
                {
                    codigo: '1',
                    rua: 'Rua 1',
                    bairro: 'Bairro 1',
                    numero: '123',
                    cep: '12345-678'
                }
            },
            {
                codigo: '2',
                ano: '2022',
                anoLetivo: '9',
                turma: 'A',
                etapa: 'f',
                periodo: 'm',
                dataAocacao: '2022-01-01',
                aluno:
                {
                    codigo: '2',
                    nome: 'Aluno 16',
                    rg: '1234567',
                    dataNasc: '2000-01-01',
                    celular: '1111-1111',
                    observacoes: 'Observacoes do Aluno 1'
                },
                escola:
                {
                    codigo: '1',
                    nome: 'Escola 1',
                    tipo: 'f',
                    email: 'zQkKs@example.com',
                    telefone: '1111-1111',
                    observacoes: 'Observacoes da Escola 1'
                },
                pontoDeEmbarque:
                {
                    codigo: '1',
                    rua: 'Rua 1',
                    bairro: 'Bairro 1',
                    numero: '123',
                    cep: '12345-678'
                }
            }
        ]
    };

    var inscricoes = [
        {
            codigo: '1',
            ano: '2022',
            anoLetivo: '9',
            turma: 'A',
            etapa: 'f',
            periodo: 'm',
            dataAocacao: '2022-01-01',
            aluno:
            {
                codigo: '1',
                nome: 'Aluno 1',
                rg: '1234567',
                dataNasc: '2000-01-01',
                celular: '1111-1111',
                observacoes: 'Observacoes do Aluno 1'
            },
            escola:
            {
                codigo: '1',
                nome: 'Escola 1',
                tipo: 'f',
                email: 'zQkKs@example.com',
                telefone: '1111-1111',
                observacoes: 'Observacoes da Escola 1'
            },
            pontoDeEmbarque:
            {
                codigo: '1',
                rua: 'Rua 1',
                bairro: 'Bairro 1',
                numero: '123',
                cep: '12345-678'
            }
        },
        {
            codigo: '2',
            ano: '2022',
            anoLetivo: '9',
            turma: 'A',
            etapa: 'f',
            periodo: 'm',
            dataAocacao: '2022-01-01',
            aluno:
            {
                codigo: '2',
                nome: 'Aluno 6',
                rg: '1234567',
                dataNasc: '2000-01-01',
                celular: '1111-1111',
                observacoes: 'Observacoes do Aluno 1'
            },
            escola:
            {
                codigo: '1',
                nome: 'Escola 1',
                tipo: 'f',
                email: 'zQkKs@example.com',
                telefone: '1111-1111',
                observacoes: 'Observacoes da Escola 1'
            },
            pontoDeEmbarque:
            {
                codigo: '1',
                rua: 'Rua 1',
                bairro: 'Bairro 1',
                numero: '123',
                cep: '12345-678'
            }
        },
        {
            codigo: '2',
            ano: '2022',
            anoLetivo: '9',
            turma: 'A',
            etapa: 'f',
            periodo: 'm',
            dataAocacao: '2022-01-01',
            aluno:
            {
                codigo: '2',
                nome: 'Aluno 2',
                rg: '1234567',
                dataNasc: '2000-01-01',
                celular: '1111-1111',
                observacoes: 'Observacoes do Aluno 1'
            },
            escola:
            {
                codigo: '1',
                nome: 'Escola 1',
                tipo: 'f',
                email: 'zQkKs@example.com',
                telefone: '1111-1111',
                observacoes: 'Observacoes da Escola 1'
            },
            pontoDeEmbarque:
            {
                codigo: '1',
                rua: 'Rua 1',
                bairro: 'Bairro 1',
                numero: '123',
                cep: '12345-678'
            }
        },
        {
            codigo: '3',
            ano: '2022',
            anoLetivo: '9',
            turma: 'A',
            etapa: 'f',
            periodo: 'm',
            dataAocacao: '2022-01-01',
            aluno:
            {
                codigo: '3',
                nome: 'Aluno 3',
                rg: '1234567',
                dataNasc: '2000-01-01',
                celular: '1111-1111',
                observacoes: 'Observacoes do Aluno 1'
            },
            escola:
            {
                codigo: '1',
                nome: 'Escola 1',
                tipo: 'f',
                email: 'zQkKs@example.com',
                telefone: '1111-1111',
                observacoes: 'Observacoes da Escola 1'
            },
            pontoDeEmbarque:
            {
                codigo: '1',
                rua: 'Rua 1',
                bairro: 'Bairro 1',
                numero: '123',
                cep: '12345-678'
            }
        },
        {
            codigo: '4',
            ano: '2022',
            anoLetivo: '9',
            turma: 'A',
            etapa: 'f',
            periodo: 'm',
            dataAocacao: '2022-01-01',
            aluno:
            {
                codigo: '4',
                nome: 'Aluno 4',
                rg: '1234567',
                dataNasc: '2000-01-01',
                celular: '1111-1111',
                observacoes: 'Observacoes do Aluno 1'
            },
            escola:
            {
                codigo: '1',
                nome: 'Escola 1',
                tipo: 'f',
                email: 'zQkKs@example.com',
                telefone: '1111-1111',
                observacoes: 'Observacoes da Escola 1'
            },
            pontoDeEmbarque:
            {
                codigo: '1',
                rua: 'Rua 1',
                bairro: 'Bairro 1',
                numero: '123',
                cep: '12345-678'
            }
        },
        {
            codigo: '5',
            ano: '2022',
            anoLetivo: '9',
            turma: 'A',
            etapa: 'f',
            periodo: 'm',
            dataAocacao: '2022-01-01',
            aluno:
            {
                codigo: '5',
                nome: 'Aluno 5',
                rg: '1234567',
                dataNasc: '2000-01-01',
                celular: '1111-1111',
                observacoes: 'Observacoes do Aluno 1'
            },
            escola:
            {
                codigo: '1',
                nome: 'Escola 1',
                tipo: 'f',
                email: 'zQkKs@example.com',
                telefone: '1111-1111',
                observacoes: 'Observacoes da Escola 1'
            },
            pontoDeEmbarque:
            {
                codigo: '1',
                rua: 'Rua 1',
                bairro: 'Bairro 1',
                numero: '123',
                cep: '12345-678'
            }
        }
    ]

    var listaRotas = [rota1, rota2, rota3];

    useEffect(() => {
        if (termoBusca.trim() === '') {
            setInscricoesFiltradas([]);
        } else {
            const inscricoesNaoAlocadas = inscricoes.filter(inscricao =>
                inscricao.aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
                !inscricoesSelecionadas.find(a => a.aluno.nome === inscricao.aluno.nome)
            );
            setInscricoesFiltradas(inscricoesNaoAlocadas);
        }
    }, [termoBusca, inscricoes, inscricoesSelecionadas]);

    const handleSelecionarRota = (rota) => {
        if (rota) {
            if (rotaSelecionada && novaRotaSelecionada !== rota) {
                setNovaRotaSelecionada(rota);
                setMostrarModalConfirmacao(true);
            } else {
                setRotaSelecionada(rota);
                setRotaEstaSelecionada(true);
                setInscricoesSelecionadas(rota.inscricoes || []);
                setTermoBusca('');
            }
        }
    };

    const confirmarTrocaRota = () => {
        setRotaSelecionada(novaRotaSelecionada);
        setRotaEstaSelecionada(true);
        setInscricoesSelecionadas(novaRotaSelecionada.inscricoes || []);
        setTermoBusca('');
        setMostrarModalConfirmacao(false);
        setNovaRotaSelecionada(null);
    };

    const cancelarTrocaRota = () => {
        setMostrarModalConfirmacao(false);
        setNovaRotaSelecionada(null);
    };

    const handleRemoverInscricao = (index) => {
        const inscricoesAtualizadas = [...rotaSelecionada.inscricoes];
        inscricoesAtualizadas.splice(index, 1);
        setRotaSelecionada({
            ...rotaSelecionada,
            inscricoes: inscricoesAtualizadas
        });
        setInscricoesSelecionadas(inscricoesAtualizadas);
    };
    const handleAdicionarInscricao = (index) => {
        const inscricao = inscricoesFiltradas[index];
        const inscricoesAtualizadas = [...rotaSelecionada.inscricoes, inscricao];
        setRotaSelecionada({
            ...rotaSelecionada,
            inscricoes: inscricoesAtualizadas
        });
        setInscricoesSelecionadas(inscricoesAtualizadas);

        const novaListaFiltrada = inscricoesFiltradas.filter((_, i) => i !== index);
        setInscricoesFiltradas(novaListaFiltrada);
    };

    return (
        <Pagina>
            <Container className="mt-4 mb-4 text-center">
                <h2>Alocar Aluno</h2>
                <Form.Group className="mb-3" controlId="selecionarRota">
                    <Form.Label>Selecione a rota:</Form.Label>
                    <Form.Select onChange={(e) => handleSelecionarRota(listaRotas.find(rota => rota.nome === e.target.value))}>
                        <option value="">Selecione...</option>
                        {listaRotas.map((rota, index) => (
                            <option key={index} value={rota.nome}>{rota.nome}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                {mostrarModalConfirmacao && (
                    <Modal show={mostrarModalConfirmacao} onHide={cancelarTrocaRota}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Troca de Rota</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Deseja realmente trocar de rota?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={cancelarTrocaRota}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={confirmarTrocaRota}>
                                Confirmar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
                {rotaEstaSelecionada && rotaSelecionada && (
                    <>
                        <Table striped bordered className="mt-4">
                            <thead>
                                <tr>
                                    <th>Nome da Rota</th>
                                    <th>Motoristas</th>
                                    <th>Monitor</th>
                                    <th>Placa do Veículo</th>
                                    <th>Pontos de Embarque</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rotaSelecionada && (
                                    <tr>
                                        <td className="text-center align-middle">{rotaSelecionada.nome}</td>
                                        <td>
                                            <ul className="text-center align-middle list-unstyled mb-0">
                                                {rotaSelecionada.motoristas.map((mot, index) => (
                                                    <li key={index}>{mot.nome}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="text-center align-middle">{rotaSelecionada.monitor.nome}</td>
                                        <td className="text-center align-middle">{rotaSelecionada.veiculo.placa}</td>
                                        <td>
                                            <ul className="text-center align-middle list-unstyled mb-0">
                                                {rotaSelecionada.pontosDeEmbarque.map((ponto, index) => (
                                                    <li key={index}>{ponto.rua}, {ponto.numero}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {inscricoesSelecionadas.map((inscricao, index) => (
                            <div key={index} className="d-flex justify-content-center align-items-center">
                                <OverlayTrigger
                                    trigger="click"
                                    key="bottom"
                                    placement="bottom"
                                    overlay={
                                        <Popover id="popover-positioned-bottom">
                                            <Popover.Header as="h3">{inscricao.aluno.nome}</Popover.Header>
                                            <Popover.Body>
                                                <p>RG: {inscricao.aluno.rg}</p>
                                                <p>Data de Nascimento: {inscricao.aluno.dataNasc}</p>
                                                <p>Celular: {inscricao.aluno.celular}</p>
                                                <p>Observações: {inscricao.aluno.observacoes}</p>
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <Button variant="light" className="me-2 mb-2 mt-4 w-50">
                                        <GrContactInfo style={{ marginRight: '15px' }} /> {`${inscricao.aluno.nome} - RG: ${inscricao.aluno.rg}`}
                                    </Button>
                                </OverlayTrigger>
                                <Button variant="danger" className="mb-2 mt-4" onClick={() => handleRemoverInscricao(index)}>
                                    Remover
                                </Button>
                            </div>
                        ))}

                        <Form.Label className="mt-4">Alunos:</Form.Label>
                        <div className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Busque um aluno"
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />
                        </div>
                        <div className="mt-2">
                            {inscricoesFiltradas.map((inscricao, index) => (
                                <div key={index} className="d-flex justify-content-center align-items-center">
                                    <OverlayTrigger
                                        trigger="click"
                                        key="bottom"
                                        placement="bottom"
                                        overlay={
                                            <Popover id="popover-positioned-bottom">
                                                <Popover.Header as="h3">{inscricao.aluno.nome}</Popover.Header>
                                                <Popover.Body>
                                                    <p>RG: {inscricao.aluno.rg}</p>
                                                    <p>Data de Nascimento: {inscricao.aluno.dataNasc}</p>
                                                    <p>Celular: {inscricao.aluno.celular}</p>
                                                    <p>Observações: {inscricao.aluno.observacoes}</p>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <Button variant="light" className="me-2 mb-2 mt-4 w-50">
                                            <GrContactInfo style={{ marginRight: '15px' }} /> {`${inscricao.aluno.nome} - RG: ${inscricao.aluno.rg}`}
                                        </Button>
                                    </OverlayTrigger>
                                    <Button
                                        variant="primary"
                                        className="mb-2 mt-4"
                                        onClick={() => handleAdicionarInscricao(index)}
                                    >
                                        Adicionar
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="primary"
                            className="mb-2 mt-4"
                            onClick={() => { }}
                        >
                            Confirmar Alocação
                        </Button>
                    </>
                )}

//             </Container>
//         </Pagina>
//     );
// }