import React, { useState, useEffect } from 'react';
import { Button, Container, OverlayTrigger, Popover, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Pagina from '../templates/Pagina';
import { getInscricoesFora } from '../redux/inscricaoReducer';
import { buscarRotas } from '../redux/rotaReducer';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { format } from 'date-fns';
import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, Header, ImageRun, WidthType, HeadingLevel } from "docx";
import { MdFileDownload } from "react-icons/md";
import { IoInformationCircleSharp } from "react-icons/io5";
import { saveAs } from 'file-saver';
import cabecalho from '../recursos/cabecalho.jpeg';


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

    const groupByRoute = (inscricoes) => {
        return inscricoes.reduce((acc, inscricao) => {
            const rotaName = inscricao.rota.nome;
            if (!acc[rotaName]) {
                acc[rotaName] = [];
            }
            acc[rotaName].push(inscricao);
            return acc;
        }, {});
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

        // Atualize os dados da tabela com os pontos de embarque
        Array.from(rows).slice(1).forEach((row, rowIndex) => {
            const inscricao = inscricoesFora[rowIndex]; // Supondo que inscricoes seja a lista de inscrições
            const pontosCell = row.cells[6]; // Ajuste isso se a coluna dos pontos de embarque for diferente
            const pontos = inscricao.rota.pontos.map((pontoEmbarque) => `• ${pontoEmbarque.bairro}. ${pontoEmbarque.rua}, ${pontoEmbarque.numero}<br>`).join('');
            pontosCell.innerHTML = pontos;
        });

        // Criação da tabela docTable
        const docTable = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: Array.from(rows).map((row, rowIndex) => {
                const rowData = Array.from(row.cells).map(cell => {
                    const isHeader = rowIndex === 0;
                    return createTableCell(cell.textContent, isHeader);
                });
                return new TableRow({
                    children: rowData,
                });
            }),
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
                                text: "Relatório: ",
                                bold: true,
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                            new TextRun({
                                text: "Alunos com Ponto de Embarque Fora dos Pontos de Embarque de Sua Rota",
                                font: {
                                    name: 'Arial',
                                    size: 12,
                                },
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
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
        saveAs(blob, nomeArquivo + '.docx');
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
                    orderByRoute ? (
                        Object.entries(groupByRoute(sortedSubscriptions)).map(([rotaName, inscricoes]) => (
                            <div key={rotaName}>
                                <h4 style={{ marginTop: '5%' }} >{rotaName}</h4>
                                <table className='tabela'>
                                    <thead className='head-tabela'>
                                        <tr>
                                            <th className='linhas-titulo-tabela' style={{ width: '10%', cursor: 'pointer' }} onClick={handleOrderByNome}>
                                                <div className='div-linhas-titulo-tabela'>Aluno {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                            </th>
                                            <th className='linhas-titulo-tabela' >
                                                <div className='div-linhas-titulo-tabela'>Endereço</div>
                                            </th>
                                            <th className='linhas-titulo-tabela' style={{ cursor: 'pointer', width: '15%' }} onClick={handleOrderByPontoEmbarque}>
                                                <div className='div-linhas-titulo-tabela'>Ponto de Embarque {!orderByPontoEmbarque ? <FaAngleUp /> : <FaAngleDown />}</div>
                                            </th>
                                            <th className='linhas-titulo-tabela' >
                                                <div className='div-linhas-titulo-tabela'>Escola</div>
                                            </th>
                                            <th className='linhas-titulo-tabela' >
                                                <div className='div-linhas-titulo-tabela'>Turma, etapa e período</div>
                                            </th>
                                            <th className='linhas-titulo-tabela' style={{ cursor: 'pointer', width: '8%' }} onClick={handleOrderByRoute}>
                                                <div className='div-linhas-titulo-tabela'>Rota {!orderByRoute ? <FaAngleUp /> : <FaAngleDown />}</div>
                                            </th>
                                            <th className='linhas-titulo-tabela' style={{ width: '10%' }}>
                                                <div className='div-linhas-titulo-tabela'>Pontos de Embarque da Rota</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='body-tabela'>
                                        {inscricoes.map((inscricao) => (
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
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {inscricao.aluno.nome}
                                                        <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                            <IoInformationCircleSharp />
                                                        </div>
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
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {inscricao.escola.nome}
                                                        <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                            <IoInformationCircleSharp />
                                                        </div>
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
                                                ><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {inscricao.rota.nome}
                                                        <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                            <IoInformationCircleSharp />
                                                        </div>
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
                                                ><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        Pontos
                                                        <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                            <IoInformationCircleSharp />
                                                        </div>
                                                    </div></OverlayTrigger></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    ) : (
                        <table className='tabela'>
                            <thead className='head-tabela'>
                                <tr>
                                    <th className='linhas-titulo-tabela' style={{ width: '10%', cursor: 'pointer' }} onClick={handleOrderByNome}>
                                        <div className='div-linhas-titulo-tabela'>Aluno {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                    </th>
                                    <th className='linhas-titulo-tabela' >
                                        <div className='div-linhas-titulo-tabela'>Endereço</div>
                                    </th>
                                    <th className='linhas-titulo-tabela' style={{ cursor: 'pointer', width: '15%' }} onClick={handleOrderByPontoEmbarque}>
                                        <div className='div-linhas-titulo-tabela'>Ponto de Embarque {!orderByPontoEmbarque ? <FaAngleUp /> : <FaAngleDown />}</div>
                                    </th>
                                    <th className='linhas-titulo-tabela' >
                                        <div className='div-linhas-titulo-tabela'>Escola</div>
                                    </th>
                                    <th className='linhas-titulo-tabela' >
                                        <div className='div-linhas-titulo-tabela'>Turma, etapa e período</div>
                                    </th>
                                    <th className='linhas-titulo-tabela' style={{ cursor: 'pointer', width: '8%' }} onClick={handleOrderByRoute}>
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
                                            ><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {inscricao.aluno.nome}
                                                    <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                        <IoInformationCircleSharp />
                                                    </div>
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
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {inscricao.escola.nome}
                                                    <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                        <IoInformationCircleSharp />
                                                    </div>
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
                                            ><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {inscricao.rota.nome}
                                                    <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                        <IoInformationCircleSharp />
                                                    </div>
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
                                            ><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    Pontos
                                                    <div style={{ width: '15%', marginLeft: '2%', textAlign: 'center' }}>
                                                        <IoInformationCircleSharp />
                                                    </div>
                                                </div></OverlayTrigger></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                )}

                <Modal show={modalArquivo} onHide={() => setModalArquivo(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Download do Arquivo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='form-group'>
                            <label>Nome do arquivo</label>
                            <input
                                type='text'
                                className='form-control'
                                value={nomeArquivo}
                                onChange={(e) => setNomeArquivo(e.target.value)}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalArquivo(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={() => {
                            exportTableToWord();
                            setModalArquivo(false);
                        }}>
                            Download
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Pagina>
    );
}

