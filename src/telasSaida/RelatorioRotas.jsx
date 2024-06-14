import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Container, OverlayTrigger, Popover, Button, Modal } from "react-bootstrap";
import { atualizarRota, buscarRotas } from "../redux/rotaReducer";
import { buscarEscolas } from "../redux/escolaReducer";
import '../templates/style.css';
import Pagina from "../templates/Pagina";
import { MdFileDownload } from "react-icons/md";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { saveAs } from 'file-saver';
import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, Header, ImageRun, WidthType } from "docx";
import cabecalho from '../recursos/cabecalho.jpeg';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './RelatorioRotas.css'; 

export default function RelatorioRotas(props) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(buscarRotas());
        dispatch(buscarEscolas());
    }, [dispatch]);

    const { rotas } = useSelector(state => state.rota);
    const [pesquisar, setPesquisar] = useState('');
    const { escolas } = useSelector(state => state.escola);
    const [rotaExpandida, setRotaExpandida] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [rotaSelecionada, setRotaSelecionada] = useState(null);
    const [acao, setAcao] = useState('');

    function manipularMudancas(evento) {
        const input = evento.target;
        const valorPesquisa = input.value;
        setPesquisar(valorPesquisa);
    }

    function defPeriodo(periodo) {
        if (periodo === 'M')
            return 'Manhã'
        else if (periodo === 'T')
            return 'Tarde'
        else
            return 'Noite'
    }

    function motoristasNomes(vetor) {
        return vetor ? vetor.map((motorista, index) =>
            `${motorista.nome}${index + 1 < vetor.length ? ',' : ''}`
        ).join('') : '';
    }

    function toggleExpandirRota(codigo) {
        if (rotaExpandida === codigo) {
            setRotaExpandida(null);
        } else {
            setRotaExpandida(codigo);
        }
    }

    function obterNomeEscolas(rota) {
        const escolasNaRota = escolas.filter(escola =>
            rota.pontos && rota.pontos.some(ponto =>
                ponto.codigo === escola.pontoEmbarque.codigo
            )
        );
        return escolasNaRota.map(escola => escola.nome).join(', ');
    }

    function abrirModal(rota, acao) {
        setRotaSelecionada(rota);
        setAcao(acao);
        setShowModal(true);
    }

    function confirmarAcao() {
        if (acao === 'desativar') {
            desativar(rotaSelecionada);
        } else if (acao === 'ativar') {
            ativar(rotaSelecionada);
        }
        setShowModal(false);
    }

    function desativar(rota) {
        const rotaAtualizada = { ...rota, status: false };
        dispatch(atualizarRota(rotaAtualizada));
    }

    function ativar(rota) {
        const rotaAtualizada = { ...rota, status: true };
        dispatch(atualizarRota(rotaAtualizada));
    }

    const base64ToUint8Array = (base64) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const fetchImageAsBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const exportTableToWord = async () => {
        const headerBase64 = await fetchImageAsBase64(cabecalho);
        const headerUint8Array = base64ToUint8Array(headerBase64);
        const pageWidth = 9 * 72;

        const headerImage = new Image();
        headerImage.src = `data:image/jpeg;base64,${headerBase64}`;
        await headerImage.decode();
        const headerImageHeight = (headerImage.height / headerImage.width) * pageWidth;

        const createTableCell = (text, isHeader) => new TableCell({
            children: [new Paragraph({
                children: [
                    new TextRun({
                        text,
                        bold: isHeader,
                        font: {
                            name: 'Arial',
                        },
                        size: isHeader ? 24 : 22,
                    }),
                ],
                alignment: AlignmentType.CENTER,
            })],
            verticalAlign: isHeader ? "center" : "top",
        });

        const headerCells = [
            "Nome da Rota", "Período", "Veículo", "Motoristas", "Pontos", "Escolas", "Monitores", "Status"
        ].map(text => createTableCell(text, true));

        const rows = rotas.map(rota => new TableRow({
            children: [
                createTableCell(rota.nome, false),
                createTableCell(defPeriodo(rota.periodo), false),
                createTableCell(rota.veiculo.map(veiculo => `${veiculo.vei_modelo} - ${veiculo.vei_placa}`).join(', '), false),
                createTableCell(motoristasNomes(rota.motoristas), false),
                createTableCell(rota.pontos.map(ponto => `${ponto.rua}, ${ponto.numero}, ${ponto.bairro}`).join('; '), false),
                createTableCell(obterNomeEscolas(rota), false),
                createTableCell(rota.monitor.map(monitor => `${monitor.mon_nome}`).join('; '), false),
                createTableCell(rota.status ? "Ativa" : "Inativa", false),
            ],
        }));

        const docTable = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [new TableRow({ children: headerCells }), ...rows],
        });

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 720,
                            right: 720,
                            bottom: 720,
                            left: 720,
                        },
                    },
                },
                headers: {
                    default: new Header({
                        margin: {
                            top: 360,
                            right: 360,
                            bottom: 360,
                            left: 360,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: headerUint8Array,
                                        transformation: {
                                            width: pageWidth,
                                            height: headerImageHeight,
                                        },
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Relatório: Rotas",
                                bold: true,
                                font: {
                                    name: 'Arial',
                                    size: 28,
                                },
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: "",
                        spacing: {
                            after: 300,
                        },
                    }),
                    docTable,
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, 'RelatorioRotas.docx');
    };

    function listarRotas(rota) {
        const isRotaAtiva = rota.status === true;

        return (
            <React.Fragment key={rota.codigo}>
                <tr>
                    <td className='linhas-tabela'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            {rota.nome} {!isRotaAtiva &&
                                <OverlayTrigger
                                    trigger="hover"
                                    key="bottom"
                                    placement="bottom"
                                    overlay={
                                        <Popover id="popover-positioned-bottom">
                                            <Popover.Body>
                                                <strong style={{ color: 'red' }}>Rota Desativada</strong>
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <GoAlertFill style={{ width: '25px', height: '25px' }} />
                                </OverlayTrigger>
                            }
                            <Button variant="link" onClick={() => toggleExpandirRota(rota.codigo)}>
                                {rotaExpandida === rota.codigo ? <FaAngleUp /> : <FaAngleDown />}
                            </Button>
                        </div>
                    </td>
                </tr>
                <TransitionGroup component={null}>
                    {rotaExpandida === rota.codigo && (
                        <CSSTransition key="details" classNames="rota" timeout={300}>
                            <tr>
                                <td className='linhas-tabela' colSpan="2">
                                    <div className="rota-detalhes">
                                        <p><strong>Período:</strong> {defPeriodo(rota.periodo)}</p>
                                        <p><strong>Veículo:</strong> {rota.veiculo.map(veiculo => `${veiculo.vei_modelo} - ${veiculo.vei_placa}`).join(', ')}</p>
                                        <p><strong>Motoristas:</strong> {motoristasNomes(rota.motoristas)}</p>
                                        <p><strong>Pontos:</strong> {rota.pontos.map(ponto => `${ponto.rua}, ${ponto.numero}, ${ponto.bairro}`).join('; ')}</p>
                                        <p><strong>Escolas:</strong> {obterNomeEscolas(rota)}</p>
                                        <p><strong>Monitores:</strong> {rota.monitor.map(monitor => `${monitor.mon_nome}`).join('; ')}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                            {isRotaAtiva ? (
                                                <Button variant="danger" onClick={() => abrirModal(rota, 'desativar')}>Desativar Rota</Button>
                                            ) : (
                                                <Button variant="success" onClick={() => abrirModal(rota, 'ativar')}>Ativar Rota</Button>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </React.Fragment>
        );
    }

    return (
        <Pagina>
            <h3 style={{ display: 'flex', justifyContent: 'center', marginTop: '1%' }}>Relatório de Rotas</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-5%', padding: '2%' }}>
                <Button onClick={() => exportTableToWord()}>
                    <MdFileDownload style={{ width: '100%', height: '100%' }} />
                </Button>
            </div>
            <div className="mb-5 d-flex align-items-center justify-content-center">
                <input
                    type="text"
                    className="form-control"
                    style={{
                        borderRadius: '10px 10px 10px 10px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        width: '750px'
                    }}
                    placeholder="Buscar inscrições pelo nome do aluno ou pelo RG..."
                    onChange={manipularMudancas}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            </div>
            <Container>
                <table className='tabela'>
                    <thead className='head-tabela'>
                        <tr>
                            <th className='linhas-titulo-tabela'>Rotas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rotas.map(rota => {
                                let nomeR = rota.nome.toLowerCase();
                                let pesL = pesquisar.toLowerCase();
                                if (pesquisar === '' || nomeR.includes(pesL)) {
                                    return listarRotas(rota);
                                }
                                return null;
                            })
                        }
                    </tbody>
                </table>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Ação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {acao === 'desativar' ? (
                        <p>Tem certeza de que deseja desativar esta rota?</p>
                    ) : (
                        <p>Tem certeza de que deseja ativar esta rota?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={confirmarAcao}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
        </Pagina>
    );
}
