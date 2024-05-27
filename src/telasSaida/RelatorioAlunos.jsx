import React, { useState, useEffect } from 'react';
import { Button, Container, Popover, OverlayTrigger, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarEscolas } from '../redux/escolaReducer';
import { buscarPontosEmbarque } from '../redux/pontosEmbarqueReducer';
import { buscarInscricoes } from '../redux/inscricaoReducer';
import { buscarAlunos } from '../redux/alunoReducer';
import Pagina from '../templates/Pagina';
import { buscarRotas } from '../redux/rotaReducer';
import { format } from 'date-fns';
import { MdFilterListAlt } from "react-icons/md";
import { PiWarningBold } from "react-icons/pi";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { TbFilterDown } from "react-icons/tb";
import { MdFileDownload } from "react-icons/md";
import { IoInformationCircleSharp } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import '../templates/style.css';
import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, Header, ImageRun, WidthType } from "docx";
import { saveAs } from 'file-saver';
import cabecalho from '../recursos/cabecalho.jpeg';

export default function TabelaInscricoes(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalArquivo, setModalArquivo] = useState(false);
    const [modalEscola, setModalEscola] = useState(false);
    const [modalPeriodo, setModalPeriodo] = useState(false);
    const [modalRota, setModalRota] = useState(false);
    const [filtroAlunosInscritos, setFiltroAlunosInscritos] = useState(false);
    const [filtroAlunosAlocados, setFiltroAlunosAlocados] = useState(false);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const { alunos } = useSelector(state => state.aluno);
    const { inscricoes } = useSelector(state => state.inscricao);
    const [escolasSelecionadas, setEscolasSelecionadas] = useState([]);
    const [periodosSelecionados, setPeriodosSelecionados] = useState([]);
    const [rotasSelecionadas, setRotasSelecionadas] = useState([]);
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);

    const dispatch = useDispatch();
    const anoAtual = new Date().getFullYear();

    function obterEscolasInscricoes(inscricoes) {
        const escs = inscricoes.map(inscricao => inscricao.escola);
        const escolasUnicas = escs.filter((escola, index) => escs.findIndex(e => e.codigo === escola.codigo) === index);
        return escolasUnicas;
    }
    const escolasDisponiveis = obterEscolasInscricoes(inscricoes);

    function obterPeriodosInscricoes(inscricoes) {
        const pers = inscricoes.map(inscricao => inscricao.periodo);
        return [...new Set(pers)];
    }
    const periodosDisponiveis = obterPeriodosInscricoes(inscricoes);

    function obterRotasInscricoes(inscricoes) {
        const rots = inscricoes
            .map(inscricao => inscricao.rota)
            .filter(rota => rota && rota.nome);
        const rotasUnicas = rots.filter((rota, index) => rots.findIndex(e => e.codigo === rota.codigo) === index);
        return rotasUnicas;
    }
    const rotasDisponiveis = obterRotasInscricoes(inscricoes);

    const obterNomePeriodoCompleto = (periodo) => {
        switch (periodo) {
            case 'I':
                return 'Integral';
            case 'M':
                return 'Matutino';
            case 'V':
                return 'Vespertino';
            default:
                return '';
        }
    };

    useEffect(() => {
        dispatch(buscarInscricoes());
        dispatch(buscarPontosEmbarque());
        dispatch(buscarEscolas());
        dispatch(buscarAlunos());
        dispatch(buscarRotas());
    }, [dispatch]);

    const { escolas } = useSelector(state => state.escola);
    const { rotas } = useSelector(state => state.rota);

    useEffect(() => {
        if (alunos.length > 0 && inscricoes.length > 0) {
            const alunosAtivos = alunos.filter(aluno => aluno.status === 'A');

            const alunosInscritosOutrosAnos = inscricoes
                .filter(inscricao => inscricao.ano !== anoAtual)
                .map(inscricao => inscricao.aluno.codigo);

            const alunosInscritosAnoAtual = inscricoes
                .filter(inscricao => inscricao.ano === anoAtual)
                .map(inscricao => inscricao.aluno.codigo);

            const alunosNaoInscritosAnoAtual = alunosAtivos.filter(aluno =>
                !alunosInscritosAnoAtual.includes(aluno.codigo)
                && alunosInscritosOutrosAnos.includes(aluno.codigo)
            );
            if (alunosNaoInscritosAnoAtual.length > 0) {
                toast.warn('Alunos desatualizados, clique para ver mais', {
                    position: "bottom-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    onClick: () => {
                        window.location.href = 'http://localhost:3000/relatorios/alunos-nao-inscritos';
                    }
                });
            }
        }
    }, [alunos, inscricoes, anoAtual]);

    useEffect(() => {
        const anoAtual = new Date().getFullYear();
        const inscricoesAtuais = inscricoes.filter(inscricao => inscricao.ano === anoAtual);
        if (escolasSelecionadas.length === 0 && periodosSelecionados.length === 0 && rotasSelecionadas.length === 0) {
            setAlunosFiltrados(alunos);
        } else {
            let alunosFiltrados = [];

            if (escolasSelecionadas.length > 0) {
                const inscricoesFiltradasPelaEscola = inscricoesAtuais.filter(inscricao =>
                    escolasSelecionadas.some(escolaSelecionada => escolaSelecionada.codigo === inscricao.escola.codigo)
                );
                const alunosEscolas = inscricoesFiltradasPelaEscola.map(inscricao => inscricao.aluno);
                alunosFiltrados = alunosEscolas;
            }

            if (periodosSelecionados.length > 0) {
                const inscricoesFiltradasPeriodo = inscricoesAtuais.filter(inscricao =>
                    periodosSelecionados.includes(inscricao.periodo)
                );
                const alunosPeriodos = inscricoesFiltradasPeriodo.map(inscricao => inscricao.aluno);
                if (alunosFiltrados.length > 0) {
                    alunosFiltrados = alunosFiltrados.filter(aluno => alunosPeriodos.includes(aluno));
                } else {
                    alunosFiltrados = alunosPeriodos;
                }
            }

            if (rotasSelecionadas.length > 0) {
                const inscricoesFiltradasRota = inscricoesAtuais.filter(inscricao =>
                    rotasSelecionadas.some(rotaSelecionada => rotaSelecionada?.codigo === inscricao.rota?.codigo)
                );
                const alunosRotas = inscricoesFiltradasRota.map(inscricao => inscricao.aluno);
                if (alunosFiltrados.length > 0) {
                    alunosFiltrados = alunosFiltrados.filter(aluno => alunosRotas.includes(aluno));
                } else {
                    alunosFiltrados = alunosRotas;
                }
            }

            setAlunosFiltrados(alunosFiltrados);
        }
    }, [inscricoes, escolasSelecionadas, periodosSelecionados, rotasSelecionadas, alunos]);

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
        const table = document.querySelector('.tabela');
        const rows = table.querySelectorAll('tr');
    
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
    
        const docTable = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: Array.from(rows).map((row, rowIndex) => new TableRow({
                children: Array.from(row.cells).map(cell => createTableCell(cell.textContent, rowIndex === 0)),
            })),
        });
    
        const nomeEscolas = escolasSelecionadas.map(escola => escola.nome).join(', ');
        const nomeRotas = rotasSelecionadas.map(rota => rota.nome).join(', ');
        const periodos = periodosSelecionados.map(obterNomePeriodoCompleto).join(', ');
    
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
                                text: "Relatório: ",
                                bold: true,
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                            new TextRun({
                                text: "Alunos",
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    escolasSelecionadas.length > 0 &&
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Escola(s): `,
                                bold: true,
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                            new TextRun({
                                text: `${nomeEscolas}.`,
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    rotasSelecionadas.length > 0 &&
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Rota(s): `,
                                bold: true,
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                            new TextRun({
                                text: `${nomeRotas}.`,
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    periodosSelecionados.length > 0 &&
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Período(s): `,
                                bold: true,
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                            new TextRun({
                                text: `${periodos}.`,
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    filtroAlunosInscritos && filtroAlunosAlocados ? new Paragraph({
                        text: `Filtro: Apenas alunos inscritos e alocados este ano`,
                        alignment: AlignmentType.CENTER,
                        font: {
                            name: 'Arial',
                        },
                    }) :
                        filtroAlunosInscritos ? new Paragraph({
                            text: `Filtro: Apenas alunos inscritos este ano`,
                            alignment: AlignmentType.CENTER,
                            font: {
                                name: 'Arial',
                            },
                        }) : filtroAlunosAlocados ? new Paragraph({
                            text: `Filtro: Apenas alunos alocados este ano`,
                            alignment: AlignmentType.CENTER,
                            font: {
                                name: 'Arial',
                            },
                        }) : null,
                    new Paragraph({
                        text: "",
                        spacing: {
                            after: 300,
                        },
                    }),
                    docTable,
                ].filter(Boolean),
            }],
        });
    
        const blob = await Packer.toBlob(doc);
        saveAs(blob, nomeArquivo + '.docx');
    };

    return (
        <Pagina>
            <h3 style={{ display: 'flex', justifyContent: 'center', marginTop: '1%' }}>Relatório de Alunos</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-6%', padding: '2%' }}>
                <Button onClick={() => setModalArquivo(true)}>
                    <MdFileDownload style={{ width: '100%', height: '100%' }} />
                </Button>
            </div>
            <ToastContainer />

            <div className="mb-5 d-flex align-items-center justify-content-center">
                <div className="input-group" style={{ width: '750px' }}>
                    <input
                        type="text"
                        className="form-control"
                        style={{
                            borderRadius: '10px 0 0 10px',
                            padding: '12px 16px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #ced4da',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        }}
                        placeholder="Buscar inscrições pelo nome do aluno ou pelo RG..."
                        value={termoBusca}
                        onChange={e => setTermoBusca(e.target.value)}
                    />
                    <div className="input-group-append">
                        <Button
                            onClick={() => setMostrarModal(true)}
                            style={{
                                borderRadius: '0 8px 8px 0',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #ced4da',
                                height: '100%',
                                width: '100%'
                            }}
                        >
                            <MdFilterListAlt />
                        </Button>

                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>

            </div>
            <table bordered hover className='tabela' style={{ magin: '5%' }}>
                <thead className='head-tabela'>
                    <tr>
                        <th className='linhas-titulo-tabela'>Aluno</th>
                        <th className='linhas-titulo-tabela'>RG</th>
                        <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} >
                            <div className='div-linhas-titulo-tabela'> Escola <TbFilterDown onClick={() => { setModalEscola(true) }} />
                            </div>
                        </th>
                        <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} >
                            <div className='div-linhas-titulo-tabela'> Período <TbFilterDown onClick={() => { setModalPeriodo(true) }} /></div>
                        </th>
                        <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} >
                            <div className='div-linhas-titulo-tabela'> Rota <TbFilterDown onClick={() => { setModalRota(true) }} /></div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {alunosFiltrados
                        .filter(aluno => aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) || aluno.rg.toLowerCase().includes(termoBusca.toLowerCase()))
                        .filter(aluno => {
                            if (filtroAlunosInscritos && filtroAlunosAlocados) {
                                return inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo) &&
                                    inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo && inscricao.rota);
                            } else if (filtroAlunosInscritos) {
                                return inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo && inscricao.ano === anoAtual);
                            } else if (filtroAlunosAlocados) {
                                return inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo && inscricao.ano === anoAtual && inscricao.rota);
                            }
                            return true;
                        })
                        .map(aluno => {
                            const inscricaoAluno = inscricoes.find(inscricao => inscricao.aluno.codigo === aluno.codigo && inscricao.ano === anoAtual);
                            const rota = inscricaoAluno ? rotas.find(rota => inscricaoAluno.rota && inscricaoAluno.rota.codigo === rota.codigo) : null;
                            const veiculo = rota ? rota.veiculo[0] : '';
                            const escola = inscricaoAluno ? escolas.find(escola => escola.codigo === inscricaoAluno.escola.codigo) : null;
                            const periodo = inscricaoAluno ? inscricaoAluno.periodo : '';
                            return (
                                <tr key={aluno.codigo}>
                                    <td className='linhas-tabela'>
                                        <OverlayTrigger
                                            trigger="hover"
                                            key="bottom"
                                            placement="bottom"
                                            overlay={
                                                <Popover id="popover-positioned-bottom">
                                                    <Popover.Header as="h3">{aluno.nome}</Popover.Header>
                                                    <Popover.Body>
                                                        <p>Data de Nascimento: {format(new Date(aluno.dataNasc), 'dd/MM/yyyy')}</p>
                                                        <p>Celular: {aluno.celular}</p>
                                                        <p>Observações: {aluno.observacoes}</p>
                                                        {aluno.status === 'I' &&
                                                            <p style={{ color: 'red' }}><b>Status: Inativo</b></p>}
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2%' }}>{aluno.nome} <IoInformationCircleSharp /> {aluno.status === 'I' && <PiWarningBold style={{ marginLeft: '2%', verticalAlign: 'middle', color: 'red' }} />} </div>
                                        </OverlayTrigger>
                                    </td>
                                    <td className='linhas-tabela'>{aluno.rg}</td>
                                    <td className='linhas-tabela'>
                                        {escola ?
                                            <OverlayTrigger
                                                trigger="hover"
                                                key="bottom"
                                                placement="bottom"
                                                overlay={
                                                    <Popover id="popover-positioned-bottom">
                                                        <Popover.Header as="h3">{escola.nome}</Popover.Header>
                                                        <Popover.Body>
                                                            <p>
                                                                Tipo: {inscricaoAluno && (
                                                                    <>
                                                                        {inscricaoAluno.escola.tipo === 'I' && 'Educação Infantil '}
                                                                        {inscricaoAluno.escola.tipo === 'F' && 'Ensino Fundamental '}
                                                                        {inscricaoAluno.escola.tipo === 'A' && 'Educação Infantil e Ensino Fundamental '}
                                                                        {inscricaoAluno.escola.tipo === 'M' && 'Ensino Médio '}
                                                                    </>
                                                                )}
                                                            </p>
                                                            <p>Email: {escola.email}</p>
                                                            <p>Telefone: {escola.telefone}</p>
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2%' }}>{escola.nome}<IoInformationCircleSharp /></div>
                                            </OverlayTrigger>
                                            : 'Aluno não inscrito...'}
                                    </td>
                                    <td className='linhas-tabela' style={{width:'15%'}}>
                                        {periodo === 'M' ? 'Matutino' : periodo === 'V' ? 'Vespertino' : periodo === 'I' ? 'Integral' : 'Aluno não inscrito...'}
                                    </td>
                                    <td className='linhas-tabela'>
                                        {rota ?
                                            <OverlayTrigger
                                                trigger="hover"
                                                key="bottom"
                                                placement="bottom"
                                                overlay={
                                                    <Popover id="popover-positioned-bottom">
                                                        <Popover.Header as="h3">{rota.nome}</Popover.Header>
                                                        <Popover.Body>
                                                            <p>Período: {rota.periodo === 'M' ? 'Matinal' : rota.periodo === 'T' ? 'Tarde' : rota.periodo === 'N' ? 'Noite' : 'Rota sem período'}</p>
                                                            <p>Distância: {rota.km} km</p>
                                                            <p>Tempo: {rota.tempoInicio} até {rota.volta}</p>
                                                            <p>Veículo: {veiculo.vei_modelo}</p>
                                                            <p>Placa: {veiculo.vei_placa}</p>
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2%' }}>{rota.nome}<IoInformationCircleSharp /></div>
                                            </OverlayTrigger> : 'Aluno não alocado...'}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                <Modal.Header closeButton>
                    Filtre os alunos:
                </Modal.Header>
                <Modal.Body>
                    <Form.Check
                        label="Apenas alunos inscritos este ano"
                        checked={filtroAlunosInscritos}
                        onChange={() => setFiltroAlunosInscritos(!filtroAlunosInscritos)}
                    />
                    <Form.Check
                        label="Apenas alunos alocados em rota este ano"
                        checked={filtroAlunosAlocados}
                        onChange={() => setFiltroAlunosAlocados(!filtroAlunosAlocados)}
                    />
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button onClick={() => setMostrarModal(false)} variant="primary">Ok</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalArquivo} onHide={() => setModalArquivo(false)}>
                <Modal.Header closeButton>
                    <strong>Baixar Arquivo</strong>
                </Modal.Header>
                <Modal.Body style={{ gap: '3%' }}>
                    <label for="nomeArquivo">Digite o nome do arquivo desejado:</label>
                    <input type="text" value={nomeArquivo} onChange={(e) => setNomeArquivo(e.target.value)} className="form-control" />
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button disabled={!nomeArquivo} onClick={() => { exportTableToWord(); setModalArquivo(false); setNomeArquivo(''); }} variant="primary">Baixar</Button>
                    <Button onClick={() => setModalArquivo(false)} variant="secondary">Cancelar</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalEscola} onHide={() => setModalEscola(false)}>
                <Modal.Header closeButton>
                    <strong>Selecione uma escola</strong>
                </Modal.Header>
                <Modal.Body style={{ gap: '3%' }}>
                    {escolasDisponiveis.map(escola => (
                        <Form.Check
                            key={escola.codigo}
                            inline
                            label={escola.nome}
                            checked={escolasSelecionadas.some((escolaSelecionada) => escolaSelecionada.codigo === escola.codigo)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setEscolasSelecionadas([...escolasSelecionadas, escola]);
                                } else {
                                    setEscolasSelecionadas(escolasSelecionadas.filter(item => item.codigo !== escola.codigo));
                                }
                            }}
                        />
                    ))}
                    <Form.Check
                        inline
                        label="Selecionar todas as escolas"
                        checked={escolasSelecionadas.length === escolasDisponiveis.length}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setEscolasSelecionadas(escolasDisponiveis);
                            } else {
                                setEscolasSelecionadas([]);
                            }
                        }}
                    />
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button onClick={() => setModalEscola(false)} variant="secondary">Ok</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalPeriodo} onHide={() => setModalPeriodo(false)}>
                <Modal.Header closeButton>
                    <strong>Selecione um Período</strong>
                </Modal.Header>
                <Modal.Body style={{ gap: '3%' }}>
                    {periodosDisponiveis.map(periodo => (
                        <Form.Check
                            key={periodo}
                            inline
                            label={obterNomePeriodoCompleto(periodo)}
                            checked={periodosSelecionados.includes(periodo)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setPeriodosSelecionados([...periodosSelecionados, periodo]);
                                } else {
                                    setPeriodosSelecionados(periodosSelecionados.filter(item => item !== periodo));
                                }
                            }}
                        />
                    ))}
                    <Form.Check
                        inline
                        label="Selecionar todos os períodos"
                        checked={periodosSelecionados.length === periodosDisponiveis.length}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setPeriodosSelecionados(periodosDisponiveis);
                            } else {
                                setPeriodosSelecionados([]);
                            }
                        }}
                    />
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button onClick={() => setModalPeriodo(false)} variant="secondary">Ok</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalRota} onHide={() => setModalRota(false)}>
                <Modal.Header closeButton>
                    <strong>Selecione uma Rota</strong>
                </Modal.Header>
                <Modal.Body style={{ gap: '3%' }}>
                    {rotasDisponiveis.map(rota => (
                        <Form.Check
                            key={rota?.codigo}
                            inline
                            label={rota?.nome}
                            checked={rotasSelecionadas.some((rotaSelecionada) => rotaSelecionada?.codigo === rota?.codigo)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setRotasSelecionadas([...rotasSelecionadas, rota]);
                                } else {
                                    setRotasSelecionadas(rotasSelecionadas.filter(item => item?.codigo !== rota?.codigo));
                                }
                            }}
                        />
                    ))}
                    <Form.Check
                        inline
                        label="Selecionar todas as rotas"
                        checked={rotasSelecionadas.length === rotasDisponiveis.length}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setRotasSelecionadas(rotasDisponiveis);
                            } else {
                                setRotasSelecionadas([]);
                            }
                        }}
                    />
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button onClick={() => setModalRota(false)} variant="secondary">Ok</Button>
                </Modal.Footer>
            </Modal>

        </Pagina>
    );
}
