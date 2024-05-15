import React, { useState, useEffect } from 'react';
import { Button, Container, OverlayTrigger, Popover } from 'react-bootstrap';
import { GrContactInfo } from "react-icons/gr";
import { useSelector, useDispatch } from 'react-redux';
import Pagina from '../templates/Pagina';
import { getInscricoesDesatualizadas } from '../redux/inscricaoReducer';
import { buscarRotas } from '../redux/rotaReducer';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

export default function RelatorioRotasDiferentes(props) {
    const { inscricoes } = useSelector(state => state.inscricao);
    const { rotas } = useSelector(state => state.rota);
    const [inscricoesFora, setInscricoesFora] = useState([]);
    const [loadedRotas, setLoadedRotas] = useState([]);
    const dispatch = useDispatch();

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
        // dispatch(getInscricoesDesatualizadas(new Date().getFullYear()));
        dispatch(getInscricoesDesatualizadas(2025));
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
    

    return (
        <Pagina>
            <Container className="">
                <h3 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Alunos com ponto de embarque fora dos pontos de embarque de sua rota:</h3>
                {inscricoesFora.length > 0 && loadedRotas.length > 0 && (
                    <table className='tabela'>
                        <thead className='head-tabela'>
                            <tr>
                                <th className='linhas-titulo-tabela' style={{ width: '10%',cursor: 'pointer' }}>
                                    <div className='div-linhas-titulo-tabela'>Ano Inscrição</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Aluno {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ width: '5%' }}>
                                    <div className='div-linhas-titulo-tabela'>RG</div>
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
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSubscriptions.map((inscricao) => {
                                return (
                                    <tr key={inscricao.codigo}>
                                        <td className="align-middle text-center">{inscricao.ano}</td>
                                        <td className="align-middle text-center">{inscricao.aluno.nome}</td>
                                        <td className="align-middle text-center">{inscricao.aluno.rg}</td>
                                        <td className="align-middle text-center">{inscricao.bairro}. {inscricao.rua}, {inscricao.numero}</td>
                                        <td className="align-middle text-center">{inscricao.pontoEmbarque.bairro}. {inscricao.pontoEmbarque.rua}, {inscricao.pontoEmbarque.numero}</td>
                                        <td className="align-middle text-center">{inscricao.escola.nome}</td>
                                        <td className="align-middle text-center">
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
                                                    ? 'I'
                                                    : 'II'
                                                : ''}, {inscricao.periodo === 'M'
                                                    ? 'Matutino'
                                                    : inscricao.periodo === 'V'
                                                        ? 'Vespertino'
                                                        : inscricao.periodo === 'I'
                                                            ? 'Integral'
                                                            : ''}
                                        </td>
                                        <td className="align-middle text-center"><OverlayTrigger
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
                                        ><Button variant="secondary" className="w-100"><GrContactInfo style={{ marginRight: '2%' }} />{inscricao.rota.nome}</Button></OverlayTrigger></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </Container>
        </Pagina>
    );
}
