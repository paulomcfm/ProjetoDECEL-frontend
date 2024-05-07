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

export default function TabelaInscricoes(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const [ordenarPorEscola, setOrdenarPorEscola] = useState(false);
    const [ordenarPorPeriodo, setOrdenarPorPeriodo] = useState(false);
    const [ordenarPorRota, setOrdenarPorRota] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filtroAlunosInscritos, setFiltroAlunosInscritos] = useState(false);
    const [filtroAlunosAlocados, setFiltroAlunosAlocados] = useState(false);
    const { alunos } = useSelector(state => state.aluno);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarInscricoes());
        dispatch(buscarPontosEmbarque());
        dispatch(buscarEscolas());
        dispatch(buscarAlunos());
        dispatch(buscarRotas());
    }, [dispatch]);

    const { escolas } = useSelector(state => state.escola);
    const { inscricoes } = useSelector(state => state.inscricao);
    const { rotas } = useSelector(state => state.rota);

    const anoAtual = new Date().getFullYear();

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
            return escolaA.localeCompare(escolaB);
        }
        else if (ordenarPorPeriodo) {
            const periodoA = (inscricoes.find(inscricao => inscricao.aluno.codigo === a.codigo)?.periodo) || '';
            const periodoB = (inscricoes.find(inscricao => inscricao.aluno.codigo === b.codigo)?.periodo) || '';
            return periodoA.localeCompare(periodoB);
        }
        else if (ordenarPorRota) {
            const rotaA = (inscricoes.find(inscricao => inscricao.aluno.codigo === a.codigo)?.rota?.nome) || '';
            const rotaB = (inscricoes.find(inscricao => inscricao.aluno.codigo === b.codigo)?.rota?.nome) || '';
            return rotaA.localeCompare(rotaB);
        }
        return 0;
    });

    return (
        <Pagina>
            <Container style={{ marginTop: '2%' }}>
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
                            placeholder="Buscar inscrições pelo nome do aluno..."
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
                <table bordered hover style={{ orderCollapse: 'collapse', width: '100%' }}>
                    <thead style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                        <tr>
                            <th style={{ padding: '1%', textAlign: 'center' }}>Aluno</th>
                            <th style={{ padding: '1%', textAlign: 'center' }}>RG</th>
                            <th style={{ padding: '1%', textAlign: 'center', cursor: 'pointer' }} onClick={handleOrdenarPorEscola}>Escola {!ordenarPorEscola ? <FaAngleUp /> : <FaAngleDown />}</th>
                            <th style={{ padding: '1%', textAlign: 'center', cursor: 'pointer' }} onClick={handleOrdenarPorPeriodo}>Período {!ordenarPorPeriodo ? <FaAngleUp /> : <FaAngleDown />}</th>
                            <th style={{ padding: '1%', textAlign: 'center', cursor: 'pointer' }} onClick={handleOrdenarPorRota}>Rota {!ordenarPorRota ? <FaAngleUp /> : <FaAngleDown />}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunosOrdenados
                            .filter(aluno => aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()))
                            .filter(aluno => {
                                if (filtroAlunosInscritos && filtroAlunosAlocados) {
                                    return inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo) &&
                                        inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo && inscricao.rota);
                                } else if (filtroAlunosInscritos) {
                                    return inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo);
                                } else if (filtroAlunosAlocados) {
                                    return inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo && inscricao.rota);
                                }
                                return true;
                            })
                            .map(aluno => {
                                const inscricaoAluno = inscricoes.find(inscricao => inscricao.aluno.codigo === aluno.codigo && inscricao.ano === anoAtual);
                                const rota = inscricaoAluno ? rotas.find(rota => inscricaoAluno.rota && inscricaoAluno.rota.codigo === rota.codigo) : null;
                                const veiculo = rota ? rota.veiculo[0] : '';
                                console.log(veiculo)
                                const escola = inscricaoAluno ? escolas.find(escola => escola.codigo === inscricaoAluno.escola.codigo) : null;
                                const periodo = inscricaoAluno ? inscricaoAluno.periodo : '';
                                return (
                                    <tr key={aluno.codigo}>
                                        <td style={{ padding: '1%', textAlign: 'center' }}>

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
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>{aluno.nome}</div>
                                            </OverlayTrigger>
                                        </td>
                                        <td style={{ padding: '1%', textAlign: 'center' }}>{aluno.rg}</td>
                                        <td style={{ padding: '1%', textAlign: 'center' }}>
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
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>{escola.nome}</div>
                                                </OverlayTrigger>
                                                : 'Aluno não inscrito...'}
                                        </td>
                                        <td style={{ padding: '1%', textAlign: 'center' }}>
                                            {periodo === 'M' ? 'Matutino' : periodo === 'V' ? 'Vespertino' : periodo === 'I' ? 'Integral' : 'Aluno não inscrito...'}
                                        </td>
                                        <td style={{ padding: '1%', textAlign: 'center' }}>
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
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>{rota.nome}</div>
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
                            label="Apenas alunos inscritos"
                            checked={filtroAlunosInscritos}
                            onChange={() => setFiltroAlunosInscritos(!filtroAlunosInscritos)}
                        />
                        <Form.Check
                            label="Apenas alunos alocados em rota"
                            checked={filtroAlunosAlocados}
                            onChange={() => setFiltroAlunosAlocados(!filtroAlunosAlocados)}
                        />
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                        <Button onClick={() => setMostrarModal(false)} variant="primary">Ok</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Pagina>
    );
}
