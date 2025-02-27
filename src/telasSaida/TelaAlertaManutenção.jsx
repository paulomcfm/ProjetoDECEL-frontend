import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Container, Card, Table, OverlayTrigger, Popover, Modal } from 'react-bootstrap';
import 'moment/locale/pt-br';
import { CSSTransition } from 'react-transition-group';
import Pagina from '../templates/Pagina.jsx';
import './telacss.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useDispatch, useSelector } from 'react-redux';
import { buscarManutencoesRelatorio } from '../redux/manutencaoReducer.js';

export default function TelaAlertaManutencao(props) {
    const [filtroPlaca, setFiltroPlaca] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [listaManutencao, setListaManutencao] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            const resposta = await dispatch(buscarManutencoesRelatorio({ inicio: null, fim: null }));
            console.log(resposta.payload.status);
            console.log(resposta.payload);
            setListaManutencao(resposta.payload.listaManutencoes);
            console.log(listaManutencao);
        }
        fetchData();
    }, [dispatch]);

    const [veiculosSelecionados, setVeiculosSelecionados] = useState([]);

    function handleButtonClick(index) {
        setVeiculosSelecionados(prev =>
            prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
        );
    }

    function listarManutencoes(manutencoes) {
        let valorTotal = 0;

        return (
            <CSSTransition in={true} timeout={500} classNames="manutencoes" unmountOnExit>
                <table className="tabela" style={{ width: '100%' }}>
                    <thead className="head-tabela">
                        <tr>
                            <th className="linhas-titulo-tabela">Tipo</th>
                            <th className="linhas-titulo-tabela">Data</th>
                            <th className="linhas-titulo-tabela">Observações</th>
                            <th className="linhas-titulo-tabela">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {manutencoes.map(manut => {
                            const valor = Number(manut.valor) || 0;
                            valorTotal += valor;
                            return (
                                <tr key={manut.codigo}>
                                    <td className="linhas-tabela">{manut.tipo === 'preventiva' ? "Preventiva" : "Corretiva"}</td>
                                    <td className="linhas-tabela">{manut.data}</td>
                                    <td className="linhas-tabela">{manut.observacoes}</td>
                                    <td className="linhas-tabela">R${valor.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                        <tr style={{ backgroundColor: 'lightgray' }}>
                            <td className="linhas-tabela" style={{ border: 'none' }}></td>
                            <td className="linhas-tabela" style={{ border: 'none' }}></td>
                            <td className="linhas-tabela" style={{ border: 'none' }}><strong>Total</strong></td>
                            <td className="linhas-tabela" style={{ border: 'none' }}><strong>R${valorTotal.toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </CSSTransition>
        );
    }

    function listarVeiculos({ veiculo, manutencao }, index) {
        console.log(veiculo.renavam, veiculo.modelo, veiculo.tipo, veiculo.capacidade);
        if (
            (filtroPlaca === "" || veiculo.placa.toLowerCase().includes(filtroPlaca.toLowerCase()))
        ) {
            return (
                <div key={veiculo.placa} style={{ width: '100%', marginTop: '10px' }}>
                    <OverlayTrigger
                        trigger="hover"
                        key="bottom"
                        placement="bottom"
                        overlay={
                            <Popover id="popover-positioned-bottom">
                                <Popover.Header as="h3">{veiculo.placa}</Popover.Header>
                                <Popover.Body>
                                    <p>Renavam: {veiculo.renavam}</p>
                                    <p>Modelo: {veiculo.modelo}</p>
                                    <p>Tipo: {veiculo.tipo}</p>
                                    <p>Capacidade: {veiculo.capacidade}</p>
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <Button
                            style={{ width: '100%' }}
                            variant={veiculosSelecionados.includes(index) ? "secondary" : "primary"}
                            onClick={() => handleButtonClick(index)}
                        >
                            {veiculo.placa}
                        </Button>
                    </OverlayTrigger>
                    {veiculosSelecionados.includes(index) && listarManutencoes(manutencao)}
                </div>
            );
        }
    }

    async function aplicarFiltro() {
        const startDate = dateRange.startDate ? dateRange.startDate.format('YYYY-MM-DD') : null;
        const endDate = dateRange.endDate ? dateRange.endDate.format('YYYY-MM-DD') : null;
        const resposta = await dispatch(buscarManutencoesRelatorio({ inicio: startDate, fim: endDate }));
        console.log(resposta.payload.status);
        console.log(resposta.payload);
        setListaManutencao(resposta.payload.listaManutencoes);
        console.log(listaManutencao);
    }

    return (
        <Pagina>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <div style={{ width: '200px' }}>
                        <Form.Control
                            type="text"
                            style={{ borderRadius: '5px' }}
                            placeholder="Pesquisar Placa"
                            value={filtroPlaca}
                            onChange={(event) => setFiltroPlaca(event.target.value)}
                        />
                    </div>
                </Row>
                <Row className="justify-content-center" style={{ marginTop: '10px' }}>
                    <Col xs={12} md={8} lg={6}>
                        <div className="justify-content-center" style={{ marginLeft: '110px', marginBottom: '10px' }}>
                            <DatePicker
                                selected={startDate}
                                onChange={(dates) => setDateRange(dates)}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                isClearable
                                placeholderText="Selecione um intervalo de datas"
                                dateFormat="dd/MM/yyyy"
                            />
                            <Button
                                style={{ marginLeft: '10px' }}
                                onClick={aplicarFiltro}
                            >
                                Filtrar
                            </Button>
                        </div>

                        <Card className="p-3 shadow-sm" style={{ borderRadius: '15px' }}>
                            {listaManutencao.length > 0 ? (
                                listaManutencao.map((veiculo, index) => listarVeiculos(veiculo, index))
                            ) : (
                                <div className="text-center text-muted">
                                    Não foi possível localizar o veículo mencionado
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Pagina>
    );
}
