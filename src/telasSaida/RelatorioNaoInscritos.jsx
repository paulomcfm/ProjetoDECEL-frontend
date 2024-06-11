import React, { useState } from 'react';
import { Button, Container, Modal, Form, Popover, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarAlunos, atualizarAluno } from '../redux/alunoReducer';
import { buscarInscricoes } from '../redux/inscricaoReducer';
import { useEffect } from 'react';
import { format } from 'date-fns';
import Pagina from '../templates/Pagina';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MdFileDownload } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import { IoPersonRemove } from "react-icons/io5";
import '../templates/style.css';
import 'react-toastify/dist/ReactToastify.css';
import { IoInformationCircleSharp } from "react-icons/io5";
import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, Header, ImageRun, WidthType } from "docx";
import { saveAs } from 'file-saver';
import cabecalho from '../recursos/cabecalho.jpeg';

export default function RelatorioAlunosNaoInscritos(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const { alunos } = useSelector(state => state.aluno);
    const { inscricoes } = useSelector(state => state.inscricao);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [modalArquivo, setModalArquivo] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [motivoInativo, setMotivoInativo] = useState('');
    const [outroMotivo, setOutroMotivo] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarAlunos());
        dispatch(buscarInscricoes());
    }, [dispatch]);

    // const anoAtual = new Date().getFullYear();
    const anoAtual = 2025;

    const alunosAtivos = alunos.filter(aluno => aluno.status === 'A'
        && (aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) || aluno.rg.includes(termoBusca)));

    const alunosInscritosOutrosAnos = inscricoes
        .filter(inscricao => inscricao.ano !== anoAtual)
        .map(inscricao => inscricao);

    const alunosInscritosAnoAtual = inscricoes
        .filter(inscricao => inscricao.ano === anoAtual)
        .map(inscricao => inscricao);

    const alunosNaoInscritosAnoAtual = alunosInscritosOutrosAnos.filter(inscricao =>
        !alunosInscritosAnoAtual.some(aluno => aluno.codigo === inscricao.codigo)
    );

    const alunosCompletos = alunosAtivos.map(aluno => {
        const inscricao = alunosNaoInscritosAnoAtual.find(
            inscricao => inscricao.aluno.codigo === aluno.codigo);
        return { aluno: aluno, inscricao: inscricao ? inscricao : null };
    });

    console.log(alunosCompletos);

    const handleMotivoChange = (e) => {
        const value = e.target.value;
        setMotivoInativo(value);
        if (value !== 'Outro') {
            setOutroMotivo('');
        }
    };

    const handleOutroMotivoChange = (e) => {
        setOutroMotivo(e.target.value);
    };

    const navigate = useNavigate();
    function handleInscreverAluno(aluno) {
        navigate('/inscricao-aluno', { state: { alunoSelecionadoRelatorio: aluno } });
    }

    function desabilitarAluno() {
        const alunoModificado = { ...mostrarModal };
        alunoModificado.status = 'I';
        if (motivoInativo === 'Outro')
            alunoModificado.motivoInativo = outroMotivo;
        else
            alunoModificado.motivoInativo = motivoInativo;
        dispatch(atualizarAluno(alunoModificado)).then((retorno) => {
            if (retorno.payload.status) {
                toast.success('Aluno desabilitado com sucesso!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                setMotivoInativo('');
                setOutroMotivo('');
                dispatch(buscarAlunos());
            } else {
                toast.error('Aluno não desabilitado! ' + retorno.payload.mensagem, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            }
        });
        setMostrarModal(false);
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
                children: [new TextRun({ text, bold: isHeader, font: { name: 'Arial' }, size: isHeader ? 24 : 22 })],
                alignment: AlignmentType.CENTER,
            })],
            verticalAlign: isHeader ? "center" : "top",
        });
    
        // Identify the index of the "Ações" column
        let actionColumnIndex = -1;
        const headerCells = Array.from(rows[0].cells);
        headerCells.forEach((cell, index) => {
            if (cell.textContent.trim() === "Ações") {
                actionColumnIndex = index;
            }
        });
    
        const filteredRows = Array.from(rows).map(row => {
            const cells = Array.from(row.cells);
            if (actionColumnIndex !== -1) {
                cells.splice(actionColumnIndex, 1); // Remove the "Ações" column
            }
            return cells;
        });
    
        const docTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: filteredRows.map((cells, rowIndex) => new TableRow({
                children: cells.map(cell => createTableCell(cell.textContent, rowIndex === 0)),
            })),
        });
    
        const doc = new Document({
            sections: [{
                properties: {
                    page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
                },
                headers: {
                    default: new Header({
                        margin: { top: 360, right: 360, bottom: 360, left: 360 },
                        children: [
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: headerUint8Array,
                                        transformation: { width: pageWidth, height: headerImageHeight },
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
                            new TextRun({ text: "Relatório: ", bold: true, font: { name: 'Arial', size: 12 } }),
                            new TextRun({ text: "Alunos não inscritos ou desatualizados", font: { name: 'Arial', size: 12 } }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Paragraph({ text: "", spacing: { after: 400 } }),
                    docTable,
                ],
            }],
        });
    
        const blob = await Packer.toBlob(doc);
        saveAs(blob, nomeArquivo + '.docx');
    };
      

    return (
        <Pagina>
            <h3 style={{ display: 'flex', justifyContent: 'center', marginTop: '1%' }}>Relatório de Alunos não Inscritos ou Desatualizados</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-6%', padding: '2%' }}>
                <Button onClick={() => setModalArquivo(true)}>
                    <MdFileDownload style={{ width: '100%', height: '100%' }} />
                </Button>
            </div>
            <Container style={{ marginTop: '2%' }}>
                <ToastContainer />
                <div className="mb-5 d-flex justify-content-center align-items-center">
                    <input
                        type="text"
                        className="form-control"
                        style={{
                            borderRadius: '8px',
                            padding: '12px 16px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #ced4da',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                            width: '750px',
                        }}
                        placeholder="Buscar alunos..."
                        value={termoBusca}
                        onChange={e => setTermoBusca(e.target.value)}
                    />
                </div>
                {alunosCompletos.length > 0 && <table className='tabela'>
                    <thead className='head-tabela'>
                        <tr>
                            <th className='linhas-titulo-tabela'>Ano Inscrição</th>
                            <th className='linhas-titulo-tabela'>Aluno</th>
                            <th className='linhas-titulo-tabela'>Escola</th>
                            <th className='linhas-titulo-tabela'>Rota</th>
                            <th className='linhas-titulo-tabela'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunosCompletos.map(aluno => (
                            <tr key={aluno.aluno.codigo}>
                                <td className='linhas-tabela'>{aluno.inscricao?.ano || 'Aluno não possui inscrição.'}</td>
                                <td className="linhas-tabela">
                                    <OverlayTrigger
                                        trigger="hover"
                                        key="bottom"
                                        placement="bottom"
                                        overlay={
                                            <Popover id="popover-positioned-bottom">
                                                <Popover.Header as="h3"></Popover.Header>
                                                <Popover.Body>
                                                    <p>RG: {aluno.aluno.rg}</p>
                                                    <p>Data de Nascimento: {format(new Date(aluno.aluno.dataNasc), 'dd/MM/yyyy')}</p>
                                                    <p>Celular: {aluno.aluno.celular}</p>
                                                    <p>Observações: {aluno.aluno.observacoes}</p>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            {aluno.aluno.nome}
                                            <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                <IoInformationCircleSharp />
                                            </div>
                                        </div></OverlayTrigger>
                                </td>
                                <td className='linhas-tabela'>{aluno.inscricao?.escola?.nome || 'Aluno não possui inscrição.'}</td>
                                {aluno.inscricao ? (
                                    aluno.inscricao.rota ? (
                                        <td className="linhas-tabela">
                                            <OverlayTrigger
                                                trigger="hover"
                                                key="bottom"
                                                placement="bottom"
                                                overlay={
                                                    <Popover id="popover-positioned-bottom">
                                                        <Popover.Header as="h3"></Popover.Header>
                                                        <Popover.Body>
                                                            <p>Motoristas:</p>
                                                            {aluno.inscricao.rota.motoristas && aluno.inscricao.rota.motoristas.length > 0 ? (
                                                                aluno.inscricao.rota.motoristas.map((motorista) => (
                                                                    <p key={motorista.id}>{motorista.nome}</p>
                                                                ))
                                                            ) : (
                                                                <p>Sem motoristas</p>
                                                            )}
                                                            {aluno.inscricao.rota.monitor && (
                                                                <p>Monitor: {aluno.inscricao.rota.monitor.nome}</p>
                                                            )}
                                                            {aluno.inscricao.rota.veiculo && (
                                                                <p>Veículo: {aluno.inscricao.rota.veiculo.modelo}, {aluno.inscricao.rota.veiculo.placa}</p>
                                                            )}
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    {aluno.inscricao.rota.nome}
                                                    <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                        <IoInformationCircleSharp />
                                                    </div>
                                                </div>
                                            </OverlayTrigger>
                                        </td>
                                    ) : (
                                        <td className="linhas-tabela">Aluno não está alocado.</td>
                                    )
                                ) : (
                                    <td className="linhas-tabela">Aluno não possui inscrição.</td>
                                )}



                                <td className='linhas-tabela' style={{ display: 'flex', alignItems: 'center', gap: '2%', justifyContent: 'center' }}>
                                    <OverlayTrigger placement="bottom" overlay={
                                        <Tooltip id="tooltip">
                                            Inscrever Aluno
                                        </Tooltip>}>
                                        <Button style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleInscreverAluno(aluno.aluno)}> <TfiWrite /></Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger placement="bottom" overlay={
                                        <Tooltip id="tooltip">
                                            Desabilitar Aluno
                                        </Tooltip>}>
                                        <Button style={{ display: 'flex', alignItems: 'center' }} variant='danger' onClick={() => setMostrarModal(aluno.aluno)}><IoPersonRemove /></Button>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
                {alunosCompletos.length == 0 && <p>Não há alunos desatualizados ou não inscritos.</p>}
                <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Desabilitar Aluno</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Selecione o motivo:</Form.Label>
                            <Form.Control
                                as="select"
                                name="motivoInativo"
                                id="motivoInativo"
                                onChange={handleMotivoChange}
                                value={motivoInativo}
                            >
                                <option>Selecione o motivo</option>
                                <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                                <option value="Mudou-se de Álvares Machado">Mudou-se de Álvares Machado</option>
                                <option value="Deixou de utilizar rede pública">Deixou de utilizar rede pública</option>
                                <option value="Outro">Outro...</option>
                            </Form.Control>
                        </Form.Group>
                        {motivoInativo === 'Outro' && (
                            <Form.Group className="mt-3">
                                <Form.Label>Digite o motivo:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={outroMotivo}
                                    onChange={handleOutroMotivoChange}
                                />
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-center">
                        <Button variant="danger" disabled={(!motivoInativo || (motivoInativo === 'Outro' && !outroMotivo))} onClick={desabilitarAluno}>Sim</Button>
                        <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
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
