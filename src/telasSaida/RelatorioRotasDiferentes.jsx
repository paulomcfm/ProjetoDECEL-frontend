import React, { useState, useEffect } from 'react';
import { Button, Container, OverlayTrigger, Popover, Modal } from 'react-bootstrap';
import { GrContactInfo } from "react-icons/gr";
import { useSelector, useDispatch } from 'react-redux';
import Pagina from '../templates/Pagina';
import { getInscricoesFora } from '../redux/inscricaoReducer';
import { buscarRotas } from '../redux/rotaReducer';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { ImZoomIn } from "react-icons/im";
import { format } from 'date-fns';
import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, HeadingLevel } from "docx";
import { MdFileDownload } from "react-icons/md";

export default function RelatorioRotasDiferentes(props) {
    const { inscricoes } = useSelector(state => state.inscricao);
    const { rotas } = useSelector(state => state.rota);
    const [inscricoesFora, setInscricoesFora] = useState([]);
    const [loadedRotas, setLoadedRotas] = useState([]);
    const dispatch = useDispatch();
    const [modalArquivo, setModalArquivo] = useState(false);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [orderByNome, setOrderByNome] = useState(false);
    const [orderByPontoEmbarque, setOrderByPontoEmbarque] = useState(false);
    const [orderByRoute, setOrderByRoute] = useState(false);

    useEffect(() => {
        const inscricoesCopy = inscricoes.map((inscricao) => {
            const rota = rotas.find((rota) => rota.codigo === inscricao.rota);
            return { ...inscricao, rota };
        });
        setInscricoesFora(inscricoesCopy);
        setLoadedRotas(rotas);
    }, [inscricoes, rotas]);

    useEffect(() => {
        dispatch(getInscricoesFora(new Date().getFullYear()));
        dispatch(buscarRotas());
    }, [dispatch]);

    const handleOrderByNome = () => {
        setOrderByNome(!orderByNome);
        setOrderByPontoEmbarque(false);
        setOrderByRoute(false);
    };

    const handleOrderByPontoEmbarque = () => {
        setOrderByPontoEmbarque(!orderByPontoEmbarque);
        setOrderByNome(false);
        setOrderByRoute(false);
    };

    const handleOrderByRoute = () => {
        setOrderByRoute(!orderByRoute);
        setOrderByNome(false);
        setOrderByPontoEmbarque(false);
    };

    const sortedSubscriptions = [...inscricoesFora].sort((a, b) => {
        const getValueToCompare = (inscricao) => {
            if (orderByNome) {
                return inscricao?.aluno?.nome || '';
            } else if (orderByPontoEmbarque) {
                return inscricao?.pontoEmbarque?.rua || '';
            } else if (orderByRoute) {
                return inscricao?.rota.nome || '';
            }
            return '';
        };

        const valueA = getValueToCompare(a).toLowerCase();
        const valueB = getValueToCompare(b).toLowerCase();

        return valueA.localeCompare(valueB);
    });

    const exportTableToWord = async () => {
        const table = document.querySelector('.tabela');
        const rows = table.querySelectorAll('tr');

        let ordenarPor = "Aluno";
        if (orderByPontoEmbarque) ordenarPor = "Ponto de Embarque";
        else if (orderByRoute) ordenarPor = "Rota";

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
                        text: "Alunos com Ponto de Embarque Fora dos Pontos de Embarque de Sua Rota",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `Ordenado por: ${ordenarPor}`,
                        alignment: AlignmentType.CENTER,
                    }),
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

    return (
        <Pagina>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-6%', padding: '2%' }}>
                <Button onClick={() => setModalArquivo(true)}>
                    <MdFileDownload style={{ width: '100%', height: '100%' }} />
                </Button>
            </div>
            <Container className="">
                <h3 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Alunos com Ponto de Embarque Fora dos Pontos de Embarque de Sua Rota:</h3>
                {inscricoesFora.length > 0 && loadedRotas.length > 0 && (
                    <table className='tabela'>
                        <thead className='head-tabela'>
                            <tr>
                                <th className='linhas-titulo-tabela' style={{ width: '10%', cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Aluno {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' >
                                    <div className='div-linhas-titulo-tabela'>Endereço</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByPontoEmbarque}>
                                    <div className='div-linhas-titulo-tabela'>Ponto de Embarque {!orderByPontoEmbarque ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' >
                                    <div className='div-linhas-titulo-tabela'>Escola</div>
                                </th>
                                <th className='linhas-titulo-tabela' >
                                    <div className='div-linhas-titulo-tabela'>Turma, etapa e período</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByRoute}>
                                    <div className='div-linhas-titulo-tabela'>Rota {!orderByRoute ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ width: '10%' }}>
                                    <div className='div-linhas-titulo-tabela'>Pontos de Embarque da Rota</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSubscriptions.map((inscricao) => {
                                return (
                                    <tr key={inscricao.codigo}>
                                        <td className="linhas-tabela"><OverlayTrigger
                                            trigger="hover"
                                            key="bottom"
                                            placement="bottom"
                                            overlay={
                                                <Popover id="popover-positioned-bottom">
                                                    <Popover.Header as="h3"></Popover.Header>
                                                    <Popover.Body>
                                                        <p>RG: {inscricao.aluno.rg}</p>
                                                        <p>Data de Nascimento: {format(new Date(inscricao.aluno.dataNasc), 'dd/MM/yyyy')}</p>
                                                        <p>Celular: {inscricao.aluno.celular}</p>
                                                        <p>Observações: {inscricao.aluno.observacoes}</p>
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        ><div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '15%', marginRight: '2%', textAlign: 'center' }}>
                                                    <ImZoomIn />
                                                </div>
                                                {inscricao.aluno.nome}
                                            </div></OverlayTrigger></td>
                                        <td className="linhas-tabela">{inscricao.bairro}. {inscricao.rua}, {inscricao.numero}</td>
                                        <td className="linhas-tabela">{inscricao.pontoEmbarque.bairro}. {inscricao.pontoEmbarque.rua}, {inscricao.pontoEmbarque.numero}</td>
                                        <td className='linhas-tabela'><OverlayTrigger
                                            trigger="hover"
                                            key="bottom"
                                            placement="bottom"
                                            overlay={
                                                <Popover id="popover-positioned-bottom">
                                                    <Popover.Body>
                                                        <p>
                                                            Tipo: {inscricao && (
                                                                <>
                                                                    {inscricao.escola.tipo === 'I' && 'Educação Infantil '}
                                                                    {inscricao.escola.tipo === 'F' && 'Ensino Fundamental '}
                                                                    {inscricao.escola.tipo === 'A' && 'Educação Infantil e Ensino Fundamental '}
                                                                    {inscricao.escola.tipo === 'M' && 'Ensino Médio '}
                                                                </>
                                                            )}
                                                        </p>
                                                        <p>Email: {inscricao.escola.email}</p>
                                                        <p>Telefone: {inscricao.escola.telefone}</p>
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: '15%', marginRight: '2%', textAlign: 'center' }}>
                                                    <ImZoomIn />
                                                </div>
                                                {inscricao.escola.nome}
                                            </div>
                                        </OverlayTrigger>
                                        </td>
                                        <td className="linhas-tabela">
                                            {inscricao.anoLetivo === '1I'
                                                ? 'Pré 1' :
                                                inscricao.anoLetivo === '2I'
                                                    ? 'Pré 2' :
                                                    inscricao.anoLetivo.includes('1')
                                                        ? '1º Ano' :
                                                        inscricao.anoLetivo.includes('2')
                                                            ? '2º Ano'
                                                            : inscricao.anoLetivo.includes('3')
                                                                ? '3º Ano'
                                                                : inscricao.anoLetivo.includes('4')
                                                                    ? '4º Ano'
                                                                    : inscricao.anoLetivo.includes('5')
                                                                        ? '5º Ano'
                                                                        : inscricao.anoLetivo.includes('6')
                                                                            ? '6º Ano'
                                                                            : inscricao.anoLetivo.includes('7')
                                                                                ? '7º Ano'
                                                                                : inscricao.anoLetivo.includes('8')
                                                                                    ? '8º Ano'
                                                                                    : inscricao.anoLetivo.includes('9')
                                                                                        ? '9º Ano'
                                                                                        : ''}
                                            {' ' + inscricao.turma}. {inscricao.etapa === 'I'
                                                ? 'Educação Infantil'
                                                : inscricao.etapa === 'F'
                                                    ? 'Ensino Fundamental'
                                                    : inscricao.etapa === 'M'
                                                        ? 'Ensino Médio'
                                                        : ''}
                                            {inscricao.etapa === 'F' ?
                                                (inscricao.anoLetivo.includes('1') ||
                                                    inscricao.anoLetivo.includes('2') ||
                                                    inscricao.anoLetivo.includes('3') ||
                                                    inscricao.anoLetivo.includes('4') ||
                                                    inscricao.anoLetivo.includes('5') ||
                                                    inscricao.anoLetivo.includes('6'))
                                                    ? ' I'
                                                    : ' II'
                                                : ''}, {inscricao.periodo === 'M'
                                                    ? 'Matutino'
                                                    : inscricao.periodo === 'V'
                                                        ? 'Vespertino'
                                                        : inscricao.periodo === 'I'
                                                            ? 'Integral'
                                                            : ''}
                                        </td>
                                        <td className="linhas-tabela"><OverlayTrigger
                                            trigger="hover"
                                            key="bottom"
                                            placement="bottom"
                                            overlay={
                                                <Popover id="popover-positioned-bottom">
                                                    <Popover.Header as="h3"></Popover.Header>
                                                    <Popover.Body>
                                                        <p>Motoristas:</p>
                                                        {inscricao.rota.motoristas.map((motorista) => (
                                                            <p>{motorista.nome}</p>
                                                        ))}
                                                        <p>Monitor: {inscricao.rota.monitor[0].mon_nome}</p>
                                                        <p>Veículo: {inscricao.rota.veiculo[0].vei_modelo}, {inscricao.rota.veiculo[0].vei_placa}</p>
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        ><div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '15%', marginRight: '2%', textAlign: 'center' }}>
                                                    <ImZoomIn />
                                                </div>
                                                {inscricao.rota.nome}
                                            </div></OverlayTrigger></td>
                                        <td className="linhas-tabela"><OverlayTrigger
                                            trigger="hover"
                                            key="bottom"
                                            placement="bottom"
                                            overlay={
                                                <Popover id="popover-positioned-bottom">
                                                    <Popover.Header as="h3"></Popover.Header>
                                                    <Popover.Body>
                                                        {inscricao.rota.pontos.map((pontoEmbarque) => (
                                                            <p>{pontoEmbarque.bairro}. {pontoEmbarque.rua}, {pontoEmbarque.numero}</p>
                                                        ))}
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        ><div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '15%', marginRight: '2%', textAlign: 'center' }}>
                                                    <ImZoomIn />
                                                </div>
                                                Pontos
                                            </div></OverlayTrigger></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                {inscricoesFora.length === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <p>Não há alunos com ponto de embarque fora dos pontos de embarque de sua rota.</p>
                </div>}
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
