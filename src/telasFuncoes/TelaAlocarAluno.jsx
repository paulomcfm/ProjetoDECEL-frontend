import { useState, useEffect } from 'react';
import React from 'react';
import { Container, Form, Table, OverlayTrigger, Popover, Modal, Button } from 'react-bootstrap';
import '../templates/style.css';
import Pagina from "../templates/Pagina";
import { GrContactInfo } from "react-icons/gr";
import { buscarInscricoes, atualizarInscricoes } from '../redux/inscricaoReducer';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import TelaMensagem from '../telasCadastro/TelaMensagem';
import { buscarRotas } from '../redux/rotaReducer';


export default function TelaAlocarAluno(props) {
    const [rotaSelecionada, setRotaSelecionada] = useState(null);
    const [rotaEstaSelecionada, setRotaEstaSelecionada] = useState(false);
    const [inscricoesSelecionadas, setInscricoesSelecionadas] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [inscricoesFiltradas, setInscricoesFiltradas] = useState([]);
    const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
    const [novaRotaSelecionada, setNovaRotaSelecionada] = useState(null);
    const { estadoInsc, mensagemIsnc, inscricoes } = useSelector(state => state.inscricao);
    const { estadoRota, mensagemRota, rotas } = useSelector(state => state.rota);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarInscricoes());
        dispatch(buscarRotas());
    }, [dispatch]);

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

    const handleSubmissao = () => {
        const dataAtual = new Date();
        const inscricoesAtualizadas = inscricoesSelecionadas.map((inscricao) => ({
            ...inscricao,
            dataAlocacao: format(dataAtual, 'yyyy-MM-dd'),
            rota: rotaSelecionada.codigo
        }));

        dispatch(atualizarInscricoes(inscricoesAtualizadas)).then((retorno) => {
            if (retorno.payload.status) {
                setMensagem('Inscricão alterada com sucesso!');
                setTipoMensagem('success');
                setMostrarMensagem(true);
            } else {
                setMensagem('Inscrição não alterada! ' + retorno.payload.mensagem);
                setTipoMensagem('danger');
                setMostrarMensagem(true);
            }
        })
        setRotaSelecionada(null);
        setInscricoesSelecionadas([]);
    };

    if (mostrarMensagem) {
        return (
            <TelaMensagem mensagem={mensagem} tipo={tipoMensagem} setMostrarMensagem={setMostrarMensagem} />
        );
    }
    else {
        return (
            <Pagina>
                <Container className="mt-4 mb-4 text-center">
                    <h2>Alocar Aluno</h2>
                    <Form.Group className="mb-3" controlId="selecionarRota">
                        <Form.Label>Selecione a rota:</Form.Label>
                        <Form.Select onChange={(e) => handleSelecionarRota(rotas.find(rota => rota.nome === e.target.value))}>
                            <option value="">Selecione...</option>
                            {rotas.map((rota, index) => (
                                <option key={index} value={rota.nome}>
                                    {rota.nome} - {rota.veiculo[0].vei_placa} - {rota.motoristas.map((motorista) => motorista.nome).join('- ')}
                                </option>
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
                                            <td className="text-center align-middle">{rotaSelecionada.monitor[0].mon_nome}</td>
                                            <td className="text-center align-middle">{rotaSelecionada.veiculo[0].vei_placa}</td>
                                            <td>
                                                <ul className="text-center align-middle list-unstyled mb-0">
                                                    {rotaSelecionada.pontos.map((ponto, index) => (
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
                                                <Popover.Header as="h3">{inscricao.aluno.aluno_nome}</Popover.Header>
                                                <Popover.Body>
                                                    <p>RG: {inscricao.aluno.aluno_rg}</p>
                                                    <p>Data de Nascimento: {format(new Date(inscricao.aluno.aluno_datanasc), 'dd/MM/yyyy')}</p>
                                                    <p>Celular: {inscricao.aluno.aluno_celular}</p>
                                                    <p>Observações: {inscricao.aluno.aluno_observacoes}</p>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <Button variant="light" className="me-2 mb-2 mt-4 w-50">
                                            <GrContactInfo style={{ marginRight: '15px' }} /> {`${inscricao.aluno.aluno_nome} - RG: ${inscricao.aluno.aluno_rg}`}
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
                                                        <p>Data de Nascimento: {format(new Date(inscricao.aluno.dataNasc), 'dd/MM/yyyy')}</p>
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
                                onClick={() => { handleSubmissao() }}
                            >
                                Confirmar Alocação
                            </Button>
                        </>
                    )}
                </Container>
            </Pagina>
        );
    }
}