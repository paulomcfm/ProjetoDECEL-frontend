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
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { MdFilterListAlt } from "react-icons/md";
import { PiWarningBold } from "react-icons/pi";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { MdFileDownload } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import '../templates/style.css';
import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, HeadingLevel } from "docx";

export default function TabelaInscricoes(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const [ordenarPorEscola, setOrdenarPorEscola] = useState(false);
    const [ordenarPorPeriodo, setOrdenarPorPeriodo] = useState(false);
    const [ordenarPorRota, setOrdenarPorRota] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalArquivo, setModalArquivo] = useState(false);
    const [filtroAlunosInscritos, setFiltroAlunosInscritos] = useState(false);
    const [filtroAlunosAlocados, setFiltroAlunosAlocados] = useState(false);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const { alunos } = useSelector(state => state.aluno);
    const { inscricoes } = useSelector(state => state.inscricao);
    const anoAtual = new Date().getFullYear();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarInscricoes());
        dispatch(buscarPontosEmbarque());
        dispatch(buscarEscolas());
        dispatch(buscarAlunos());
        dispatch(buscarRotas());
    }, [dispatch]);

    const { escolas } = useSelector(state => state.escola);
    const { rotas } = useSelector(state => state.rota);

    const handleOrdenarPorEscola = () => {
        setOrdenarPorPeriodo(false);
        setOrdenarPorRota(false);
        setOrdenarPorEscola(!ordenarPorEscola);
    };

    const handleOrdenarPorPeriodo = () => {
        setOrdenarPorEscola(false);
        setOrdenarPorRota(false);
        setOrdenarPorPeriodo(!ordenarPorPeriodo);
    };

    const handleOrdenarPorRota = () => {
        setOrdenarPorEscola(false);
        setOrdenarPorPeriodo(false);
        setOrdenarPorRota(!ordenarPorRota);
    };

    const alunosOrdenados = [...alunos].sort((a, b) => {
        if (ordenarPorEscola) {
            const escolaA = inscricoes.find(inscricao => inscricao.aluno.codigo === a.codigo)?.escola.nome || '';
            const escolaB = inscricoes.find(inscricao => inscricao.aluno.codigo === b.codigo)?.escola.nome || '';
            console.log(escolaA, escolaB);
            return escolaA.localeCompare(escolaB);
        }
        else if (ordenarPorPeriodo) {
            const periodoA = (inscricoes.find(inscricao => inscricao.aluno.codigo === a.codigo)?.periodo) || '';
            const periodoB = (inscricoes.find(inscricao => inscricao.aluno.codigo === b.codigo)?.periodo) || '';
            console.log(periodoA, periodoB);
            return periodoA.localeCompare(periodoB);
        }
        else if (ordenarPorRota) {
            const rotaA = (inscricoes.find(inscricao => inscricao.aluno.codigo === a.codigo)?.rota?.nome) || '';
            const rotaB = (inscricoes.find(inscricao => inscricao.aluno.codigo === b.codigo)?.rota?.nome) || '';
            return rotaA.localeCompare(rotaB);
        }
        return 0;
    });

    const exportTableToWord = async () => {
        const table = document.querySelector('.tabela');
        const rows = table.querySelectorAll('tr');

        let ordenarPor = "Aluno";
        if (ordenarPorEscola) ordenarPor = "Escola";
        else if (ordenarPorPeriodo) ordenarPor = "Período";
        else if (ordenarPorRota) ordenarPor = "Rota";

        const docTable = new Table({
            rows: Array.from(rows).map((row, rowIndex) => new TableRow({
                children: Array.from(row.cells).map(cell => new TableCell({
                    children: [new Paragraph({
                        children: [
                            new TextRun({
                                text: cell.textContent,
                                bold: rowIndex === 0,
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: {
                            before: 200,
                            after: 200,
                        },
                    })],
                    width: {
                        size: 100 / row.cells.length,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 100,
                        bottom: 100,
                        left: 100,
                        right: 100,
                    },
                })),
            })),
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            alignment: AlignmentType.CENTER,
            margins: {
                left: 300,
                right: 300,
            },
        });

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: "Relatório de Alunos",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `Ordenado por: ${ordenarPor}`,
                        alignment: AlignmentType.CENTER,
                    }),
                    filtroAlunosInscritos && filtroAlunosAlocados ? new Paragraph({
                        text: `Filtro: Apenas alunos inscritos e alocados este ano`,
                        alignment: AlignmentType.CENTER,
                    }) :
                        filtroAlunosInscritos ? new Paragraph({
                            text: `Filtro: Apenas alunos inscritos este ano`,
                            alignment: AlignmentType.CENTER,
                        }) : filtroAlunosAlocados ? new Paragraph({
                            text: `Filtro: Apenas alunos alocados este ano`,
                            alignment: AlignmentType.CENTER,
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
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo + '.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

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
            console.log(alunosNaoInscritosAnoAtual);
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

    return (
        <Pagina>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-6%', padding: '2%' }}>
                    <Button onClick={() => setModalArquivo(true)}>
                        <MdFileDownload style={{width: '100%', height: '100%'}}/>
                    </Button>
                </div>
            <Container style={{ marginTop: '2%' }}>
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
                <table bordered hover className='tabela'>
                    <thead className='head-tabela'>
                        <tr>
                            <th className='linhas-titulo-tabela'>Aluno</th>
                            <th className='linhas-titulo-tabela'>RG</th>
                            <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrdenarPorEscola}>
                                <div className='div-linhas-titulo-tabela'>Escola {!ordenarPorEscola ? <FaAngleUp /> : <FaAngleDown />}
                                </div>
                            </th>
                            <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrdenarPorPeriodo}>
                                <div className='div-linhas-titulo-tabela'> Período {!ordenarPorPeriodo ? <FaAngleUp /> : <FaAngleDown />}</div>
                            </th>
                            <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrdenarPorRota}>
                                <div className='div-linhas-titulo-tabela'> Rota {!ordenarPorRota ? <FaAngleUp /> : <FaAngleDown />}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunosOrdenados
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
                                                <div>{aluno.nome} {aluno.status === 'I' && <PiWarningBold style={{ marginLeft: '2%', verticalAlign: 'middle', color: 'red' }} />}</div>
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
                                                    <div>{escola.nome}</div>
                                                </OverlayTrigger>
                                                : 'Aluno não inscrito...'}
                                        </td>
                                        <td className='linhas-tabela'>
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
                                                    <div>{rota.nome}</div>
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
            </Container>
        </Pagina>
    );
}
