import React, { useState, useEffect } from 'react';
import { Button, Container, Table, OverlayTrigger, Popover } from 'react-bootstrap';
import { GrContactInfo } from "react-icons/gr";
import { useSelector, useDispatch } from 'react-redux';
import Pagina from '../templates/Pagina';
import { getInscricoesFora } from '../redux/inscricaoReducer';
import { buscarRotas } from '../redux/rotaReducer';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

export default function RelatorioRotasDiferentes(props) {
    const { inscricoes } = useSelector(state => state.inscricao);
    const { rotas } = useSelector(state => state.rota);
    const [inscricoesFora, setInscricoesFora] = useState([]);
    const [loadedRotas, setLoadedRotas] = useState([]);
    const dispatch = useDispatch();

    const [orderByNome, setOrderByNome] = useState(false);

    useEffect(() => {
        setInscricoesFora(inscricoes);
        setLoadedRotas(rotas);
    }, [inscricoes, rotas]);

    useEffect(() => {
        dispatch(getInscricoesFora(new Date().getFullYear()));
        dispatch(buscarRotas());
    }, [dispatch]);

    const handleOrderByNome = () => {
        setOrderByNome(!orderByNome);
        if (orderByNome) {
            setInscricoesFora(inscricoes.sort((a, b) => (a.aluno.nome > b.aluno.nome) ? 1 : ((b.aluno.nome > a.aluno.nome) ? -1 : 0)));
        } else {
            setInscricoesFora(inscricoes.sort((a, b) => (a.aluno.nome < b.aluno.nome) ? 1 : ((b.aluno.nome < a.aluno.nome) ? -1 : 0)));
        }
    }

    return (
        <Pagina>
            <Container className="">
                <h3>Alunos com ponto de embarque fora dos pontos de embarque de sua rota:</h3>
                {loadedRotas.length > 0 && (
                    <table className='tabela'>
                        <thead className='head-tabela'>
                            <tr>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Aluno {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer', width: '5%' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>RG {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Endereço {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Ponto de Embarque {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Escola {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Turma, etapa e período {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Rota {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                                <th className='linhas-titulo-tabela' style={{ cursor: 'pointer' }} onClick={handleOrderByNome}>
                                    <div className='div-linhas-titulo-tabela'>Pontos de Embarque da Rota {!orderByNome ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscricoesFora.map((inscricao) => {
                                const rota = loadedRotas.find((rota) => rota.codigo === inscricao.rota);
                                return (
                                    <tr key={inscricao.codigo}>
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
                                                        {rota.motoristas.map((motorista) => (
                                                            <p>{motorista.nome}</p>
                                                        ))}
                                                        <p>Monitor: {rota.monitor[0].mon_nome}</p>
                                                        <p>Veículo: {rota.veiculo[0].vei_modelo}, {rota.veiculo[0].vei_placa}</p>
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        ><Button variant="secondary" className="w-100"><GrContactInfo style={{ marginRight: '2%' }} />{rota.nome}</Button></OverlayTrigger></td>
                                        <td className="align-middle text-center"><OverlayTrigger
                                            trigger="hover"
                                            key="bottom"
                                            placement="bottom"
                                            overlay={
                                                <Popover id="popover-positioned-bottom">
                                                    <Popover.Header as="h3"></Popover.Header>
                                                    <Popover.Body>
                                                        {rota.pontos.map((pontoEmbarque) => (
                                                            <p>{pontoEmbarque.bairro}. {pontoEmbarque.rua}, {pontoEmbarque.numero}</p>
                                                        ))}
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        ><Button variant="secondary" className="w-100"><GrContactInfo style={{ marginRight: '2%' }} />Pontos</Button></OverlayTrigger></td>
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
