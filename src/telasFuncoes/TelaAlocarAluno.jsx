import { useState, useEffect } from 'react';
import React from 'react';
import { Container, Form, Table, OverlayTrigger, Popover, Modal, Button } from 'react-bootstrap';
import '../templates/style.css';
import Pagina from "../templates/Pagina";
import { GrContactInfo } from "react-icons/gr";
import { PiWarningBold } from "react-icons/pi";
import { buscarInscricoes } from '../redux/inscricaoReducer';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import TelaMensagem from '../telasCadastro/TelaMensagem';
import { buscarRotasInscricoes } from '../redux/rotaReducer';
import { buscarEscolaPorPonto } from '../redux/escolaReducer';
import { atualizarInscricoes } from '../redux/alocarReducer';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function TelaAlocarAluno(props) {
    const [rotaSelecionada, setRotaSelecionada] = useState(null);
    const [rotaEstaSelecionada, setRotaEstaSelecionada] = useState(false);
    const [inscricoesSelecionadas, setInscricoesSelecionadas] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [inscricoesFiltradas, setInscricoesFiltradas] = useState([]);
    const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
    const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
    const [mostrarModalRemover, setMostrarModalRemover] = useState(false);
    const [novaRotaSelecionada, setNovaRotaSelecionada] = useState(null);
    const { estadoInsc, mensagemIsnc, inscricoes } = useSelector(state => state.inscricao);
    const { estadoRota, mensagemRota, rotas } = useSelector(state => state.rota);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [escolasRota, setEscolasRota] = useState(null);
    const [inscricoesFora, setInscricoesFora] = useState([]);
    const [indiceRotaSelecionadaAnterior, setIndiceRotaSelecionadaAnterior] = useState(null);
    const [rotasCarregadas, setRotasCarregadas] = useState([]);
    const [indexInscricaoSelecionada, setIndexInscricaoSelecionada] = useState(null);
    const [outdatedRoutes, setOutdatedRoutes] = useState([]);
    const [toastController, setToastController] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarInscricoes());
        dispatch(buscarRotasInscricoes());
    }, [dispatch]);

    useEffect(() => {
        setRotasCarregadas(rotas);
    }, [rotas]);

    useEffect(() => {
        if (inscricoes.length > 0) {
            const curYear = new Date().getFullYear();
            // const curYear = 2025;
            const outdatedSubscriptions = inscricoes.filter((inscricao) => {
                if (inscricao.dataAlocacao != null) {
                    const dataAlocacao = new Date(inscricao.dataAlocacao);
                    return dataAlocacao.getFullYear() < curYear;
                }
            });
            const outdatedRoutes = [];
            outdatedSubscriptions.forEach((inscricao) => {
                if (!outdatedRoutes.includes(inscricao.rota)) {
                    outdatedRoutes.push(inscricao.rota);
                }
            });
            setOutdatedRoutes(outdatedRoutes);
        }
    }, [inscricoes, rotasCarregadas]);

    if (!toastController && outdatedRoutes.length > 0) {
        let i = 0;
        outdatedRoutes.forEach((rota) => {
            const rotaEncontrada = rotasCarregadas.find((r) => r.codigo === rota);
            if (rotaEncontrada) {
                toast.warn(`Há alunos com alocações desatualizadas na rota ${rotaEncontrada.nome}`,{
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    delay: i,
                    transition: Bounce,
                });
                i = i + 3000;
            }
        });
        setToastController(true);
    }

    useEffect(() => {
        if (termoBusca.trim() === '') {
            setInscricoesFiltradas([]);
        } else {
            const inscricoesNaoAlocadas = inscricoes.filter(inscricao =>
                inscricao.aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
                escolasRota.some(escola => escola.codigo === inscricao.escola.codigo) &&
                !inscricoesSelecionadas.find(a => a.aluno.nome === inscricao.aluno.nome) &&
                inscricao.ano === new Date().getFullYear()
            );
            setInscricoesFiltradas(inscricoesNaoAlocadas);
            settingInscricoesFora();
        }
    }, [termoBusca, inscricoes, inscricoesSelecionadas]);


    useEffect(() => {
        settingInscricoesFora();
    }, [rotaSelecionada]);

    useEffect(() => {
        setInscricoesSelecionadas(inscricoesSelecionadas);
    }, [inscricoesSelecionadas]);

    const settingInscricoesFora = () => {
        if (rotaSelecionada) {
            const inscricoesFora = inscricoes.filter(inscricao =>
                !rotaSelecionada.pontos.some(ponto => ponto.codigo === inscricao.pontoEmbarque.codigo)
            );
            setInscricoesFora(inscricoesFora);
        }
    };

    const handleSelecionarRota = async (rota) => {
        if (rota) {
            if (rotaSelecionada && novaRotaSelecionada !== rota) {
                setIndiceRotaSelecionadaAnterior(rotas.findIndex(r => r.nome === rotaSelecionada.nome));
                setNovaRotaSelecionada(rota);
                setMostrarModalConfirmacao(true);
            } else {
                setRotaSelecionada(rota);
                setRotaEstaSelecionada(true);
                setInscricoesSelecionadas(rota.inscricoes || []);
                setTermoBusca('');
            }
            let escolasRota = [];
            for (const ponto of rota.pontos) {
                const action = await dispatch(buscarEscolaPorPonto(ponto.codigo));
                escolasRota = [...escolasRota, ...action.payload.listaEscolas];
            }
            setEscolasRota(escolasRota);
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
        if (indiceRotaSelecionadaAnterior !== null) {
            document.getElementById('selecionarRota').selectedIndex = indiceRotaSelecionadaAnterior + 1;
        }
        setIndiceRotaSelecionadaAnterior(null);
    };

    const handleRemoverInscricao = (index) => {
        const inscricoesAtualizadas = [...rotaSelecionada.inscricoes];
        inscricoesAtualizadas.splice(index, 1);
        setRotaSelecionada({
            ...rotaSelecionada,
            inscricoes: inscricoesAtualizadas
        });
        setInscricoesSelecionadas(inscricoesAtualizadas);
        setMostrarModalRemover(false);
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

    const handleSubmissao = async () => {
        const dataAtual = new Date();
        const inscricoesAtualizadas = inscricoesSelecionadas.map((inscricao) => ({
            ...inscricao,
            dataAlocacao: format(dataAtual, 'yyyy-MM-dd'),
            rota: rotaSelecionada.codigo
        }));
        if (inscricoesSelecionadas.length === 0) {
            inscricoesAtualizadas.push({
                rota: rotaSelecionada.codigo,
                aluno: { codigo: 0 }
            });
        }
        dispatch(atualizarInscricoes(inscricoesAtualizadas)).then(async (retorno) => {
            if (retorno.payload.status) {
                setMensagem(retorno.payload.mensagem);
                setTipoMensagem('success');
                setMostrarMensagem(true);
            } else {
                setMensagem('Inscrição não alterada! ' + retorno.payload.mensagem);
                setTipoMensagem('danger');
                setMostrarMensagem(true);
            }
            await dispatch(buscarRotasInscricoes()).then(() => {
                dispatch(buscarInscricoes()).then(() => {
                    setRotaSelecionada(null);
                    setRotaEstaSelecionada(false);
                    setInscricoesSelecionadas([]);
                    setTermoBusca('');
                    setInscricoesFiltradas([]);
                    setMostrarModalConfirmacao(false);
                    setNovaRotaSelecionada(null);
                });
            });
        });
    };

    const handleCancelarAlocacao = () => {
        setMostrarModalCancelar(true);
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
                    <h2>Alocar Alunos</h2>
                    <Form.Group className="mb-3" controlId="selecionarRota">
                        <Form.Label>Selecione a rota:</Form.Label>
                        <Form.Select onChange={(e) => handleSelecionarRota(rotasCarregadas.find(rota => rota.nome === e.target.value))}>
                            <option value="">Selecione um rota...</option>
                            {rotasCarregadas.map((rota, index) => (
                                <option key={index} value={rota.nome}>
                                    {rota.nome} - {rota.veiculo[0].vei_placa} - {rota.motoristas.map((motorista) => motorista.nome).join('- ')}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {mostrarModalConfirmacao && (
                        <Modal show={mostrarModalConfirmacao} onHide={cancelarTrocaRota}>
                            <Modal.Header closeButton onHide={() => setMostrarModalCancelar(false)}>
                                <Modal.Title>Confirmar Troca de Rota</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Deseja realmente trocar de rota?</Modal.Body>
                            <Modal.Footer className='d-flex justify-content-center'>
                                <Button variant="primary" onClick={confirmarTrocaRota}>
                                    Confirmar
                                </Button>
                                <Button variant="danger" onClick={cancelarTrocaRota}>
                                    Cancelar
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
                            <>
                                <h4>Alunos da Rota</h4>
                                {inscricoesSelecionadas.length === 0 ? (
                                    <p>Não há alunos alocados na rota</p>
                                ) : (
                                    inscricoesSelecionadas.map((inscricao, index) => {
                                        const possuiPontoFora = inscricoesFora.some(fora => fora.aluno.codigo === inscricao.aluno.codigo);

                                        return (
                                            <div key={index} className="d-flex justify-content-center align-items-center">
                                                <OverlayTrigger
                                                    trigger="hover"
                                                    key="bottom"
                                                    placement="bottom"
                                                    overlay={
                                                        <Popover id="popover-positioned-bottom">
                                                            <Popover.Header as="h3">{inscricao.aluno.nome}</Popover.Header>
                                                            <Popover.Body>
                                                                {possuiPontoFora && (
                                                                    <p><PiWarningBold style={{ marginRight: '2% ', color: 'red' }} />Aluno possui ponto de embarque fora dos pontos de embarque da rota!</p>
                                                                )}
                                                                <p>RG: {inscricao.aluno.rg}</p>
                                                                <p>Data de Nascimento: {format(new Date(inscricao.aluno.dataNasc), 'dd/MM/yyyy')}</p>
                                                                <p>Celular: {inscricao.aluno.celular}</p>
                                                                <p>Observações: {inscricao.aluno.observacoes}</p>
                                                            </Popover.Body>
                                                        </Popover>
                                                    }
                                                >
                                                    <Button variant="light" className="me-2 mb-2 mt-4 w-50">
                                                        <GrContactInfo style={{ marginRight: '2%' }} /> {`${inscricao.aluno.nome} - RG: ${inscricao.aluno.rg}`}
                                                        {possuiPontoFora && (
                                                            <PiWarningBold style={{ marginLeft: '2%', verticalAlign: 'middle', color: 'red' }} />
                                                        )}
                                                    </Button>
                                                </OverlayTrigger>
                                                <Button variant="danger" className="mb-2 mt-4 me-2" onClick={() => { setMostrarModalRemover(true); setIndexInscricaoSelecionada(index) }}>
                                                    Remover
                                                </Button>
                                            </div>
                                        );
                                    })
                                )}
                            </>
                            <Form.Label className="mt-4">Busque alunos:</Form.Label>
                            <div className="d-flex">
                                <Form.Control
                                    type="text"
                                    placeholder="Pesquise o nome do aluno..."
                                    value={termoBusca}
                                    onChange={(e) => setTermoBusca(e.target.value)}
                                />
                            </div>
                            <div className="mt-2">
                                {inscricoesFiltradas.map((inscricao, index) => {
                                    const possuiPontoFora = inscricoesFora.some(fora => fora.aluno.codigo === inscricao.aluno.codigo);

                                    return (
                                        <div key={index} className="d-flex justify-content-center align-items-center">
                                            <OverlayTrigger
                                                trigger="hover"
                                                key="bottom"
                                                placement="bottom"
                                                overlay={
                                                    <Popover id="popover-positioned-bottom">
                                                        <Popover.Header as="h3">{inscricao.aluno.nome}</Popover.Header>
                                                        <Popover.Body>
                                                            {possuiPontoFora && (
                                                                <p><PiWarningBold style={{ marginRight: '2% ', color: 'red' }} />Aluno possui ponto de embarque fora dos pontos de embarque da rota!</p>
                                                            )}
                                                            <p>RG: {inscricao.aluno.rg}</p>
                                                            <p>Data de Nascimento: {format(new Date(inscricao.aluno.dataNasc), 'dd/MM/yyyy')}</p>
                                                            <p>Celular: {inscricao.aluno.celular}</p>
                                                            <p>Observações: {inscricao.aluno.observacoes}</p>
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <Button variant="light" className="me-2 mb-2 mt-4 w-50">
                                                    <GrContactInfo style={{ marginRight: '2%' }} /> {`${inscricao.aluno.nome} - RG: ${inscricao.aluno.rg}`}
                                                    {possuiPontoFora && (
                                                        <PiWarningBold style={{ marginLeft: '2%', verticalAlign: 'middle', color: 'red' }} />
                                                    )}
                                                </Button>
                                            </OverlayTrigger>
                                            <Button
                                                variant="primary"
                                                className="mb-2 mt-4 me-2"
                                                onClick={() => handleAdicionarInscricao(index)}
                                            >
                                                Adicionar
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                            <Button
                                variant="primary"
                                className="mb-2 mt-4 me-2"
                                onClick={() => { handleSubmissao() }}
                            >
                                Confirmar Alocação
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => { handleCancelarAlocacao() }}
                                className="mb-2 mt-4"
                            >
                                Cancelar Alocação
                            </Button>
                            {mostrarModalCancelar && (
                                <Modal show={mostrarModalCancelar} onHide={() => setMostrarModalCancelar(false)}>
                                    <Modal.Header closeButton onHide={() => setMostrarModalCancelar(false)}>
                                        <Modal.Title>Cancelar Alocação</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Deseja realmente cancelar a alocação?
                                    </Modal.Body>
                                    <Modal.Footer className='d-flex justify-content-center'>
                                        <Button variant="danger" onClick={() => {
                                            setRotaSelecionada(null);
                                            setRotaEstaSelecionada(false);
                                            setInscricoesSelecionadas([]);
                                            setTermoBusca('');
                                            setInscricoesFiltradas([]);
                                            setMostrarModalConfirmacao(false);
                                            setNovaRotaSelecionada(null);
                                            document.getElementById('selecionarRota').selectedIndex = 0;
                                            setMostrarModalCancelar(false);
                                        }}>
                                            Sim
                                        </Button>
                                        <Button variant="secondary" onClick={() => setMostrarModalCancelar(false)}>
                                            Não
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            )}
                            {mostrarModalRemover && (
                                <Modal show={mostrarModalRemover} onHide={() => setMostrarModalRemover(false)}>
                                    <Modal.Header closeButton onHide={() => setMostrarModalRemover(false)}>
                                        <Modal.Title>Remover Inscrição</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Deseja realmente remover essa inscrição?
                                    </Modal.Body>
                                    <Modal.Footer className='d-flex justify-content-center'>
                                        <Button variant="danger" onClick={() => {
                                            handleRemoverInscricao(indexInscricaoSelecionada);
                                        }}>
                                            Sim
                                        </Button>
                                        <Button variant="secondary" onClick={() => setMostrarModalRemover(false)}>
                                            Não
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            )}
                        </>
                    )}
                </Container>
                <ToastContainer />
            </Pagina>
        );
    }
}