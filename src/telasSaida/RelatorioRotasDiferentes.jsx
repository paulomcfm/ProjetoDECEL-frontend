import React, { useState, useEffect } from 'react';
import { Button, Container, Table, OverlayTrigger, Popover } from 'react-bootstrap';
import { GrContactInfo } from "react-icons/gr";
import { useSelector, useDispatch } from 'react-redux';
import Pagina from '../templates/Pagina';
import { getInscricoesFora } from '../redux/inscricaoReducer';
import { buscarRotas } from '../redux/rotaReducer';

export default function RelatorioRotasDiferentes(props) {
    const { inscricoes } = useSelector(state => state.inscricao);
    const { rotas } = useSelector(state => state.rota);
    const [inscricoesFora, setInscricoesFora] = useState([]);
    const [loadedRotas, setLoadedRotas] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setInscricoesFora(inscricoes);
        setLoadedRotas(rotas);
    }, [inscricoes, rotas]);

    useEffect(() => {
        dispatch(getInscricoesFora(new Date().getFullYear()));
        dispatch(buscarRotas());
    }, [dispatch]);

    return (
        <Pagina>
            <Container className="mt-4 mb-4 text-center">
                <h3>Alunos com ponto de embarque fora dos pontos de embarque de sua rota:</h3>
                {loadedRotas.length > 0 && (
                    <Table className='mt-4' striped bordered hover >
                        <thead>
                            <tr>
                                <th className='col-2 align-middle text-center'>Aluno</th>
                                <th className="align-middle text-center">RG</th>
                                <th className="align-middle text-center">Endereço</th>
                                <th className="align-middle text-center">Ponto de Embarque</th>
                                <th className="align-middle text-center">Escola</th>
                                <th className="align-middle text-center">Turma, etapa e período</th>
                                <th className='col-2 align-middle text-center'>Rota</th>
                                <th className="align-middle text-center">Pontos de Embarque da Rota</th>
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
                                            {inscricao.turma}. {inscricao.etapa === 'I'
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
                    </Table>
                )}
            </Container>
        </Pagina>
    );
}
