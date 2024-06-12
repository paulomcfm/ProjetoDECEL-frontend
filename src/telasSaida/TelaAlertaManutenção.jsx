import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Container, Card } from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import 'moment/locale/pt-br';
import 'react-dates/lib/css/_datepicker.css';
import { CSSTransition } from 'react-transition-group';
import Pagina from '../templates/Pagina.jsx';
import 'react-dates/initialize';
import './telacss.css';

import { useDispatch, useSelector } from 'react-redux';
import { buscarManutencoesRelatorio } from '../redux/manutencaoReducer.js';

export default function TelaAlertaManutencao(props) {
    const [filtroPlaca, setFiltroPlaca] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [focusedInput, setFocusedInput] = useState(null);
    const [listaManutencao, setListaManutencao] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            const resposta = await dispatch(buscarManutencoesRelatorio({ inicio: null, fim: null }))
            console.log(resposta.payload.status)
            console.log(resposta.payload)
            setListaManutencao(resposta.payload.listaManutencoes)
            console.log(listaManutencao)
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
                            const valor = Number(manut.valor) || 0;  // Converte para número
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
        if (
            (filtroPlaca === "" || veiculo.placa.toLowerCase().includes(filtroPlaca.toLowerCase()))
        ) {
            return (
                <div key={veiculo.placa} style={{ width: '100%', marginTop: '10px' }}>
                    <Button
                        style={{ width: '100%' }}
                        variant={veiculosSelecionados.includes(index) ? "secondary" : "primary"}
                        onClick={() => handleButtonClick(index)}
                    >
                        {veiculo.placa}
                    </Button>
                    {veiculosSelecionados.includes(index) && listarManutencoes(manutencao)}
                </div>
            );
        }
    }

    async function aplicarFiltro() {
        const startDate = dateRange.startDate ? dateRange.startDate.format('YYYY-MM-DD') : null;
        const endDate = dateRange.endDate ? dateRange.endDate.format('YYYY-MM-DD') : null;
        const resposta = await dispatch(buscarManutencoesRelatorio({ inicio: startDate, fim: endDate }))
        console.log(resposta.payload.status)
        console.log(resposta.payload)
        setListaManutencao(resposta.payload.listaManutencoes)
        console.log(listaManutencao)
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
                            <DateRangePicker
                                startDate={dateRange.startDate}
                                startDateId="startDate"
                                endDate={dateRange.endDate}
                                endDateId="endDate"
                                onDatesChange={({ startDate, endDate }) => setDateRange({ startDate, endDate })}
                                focusedInput={focusedInput}
                                onFocusChange={setFocusedInput}
                                isOutsideRange={() => false}
                                displayFormat="DD/MM/YYYY"
                                numberOfMonths={1}
                                showClearDates={true}
                                startDatePlaceholderText="Início"
                                endDatePlaceholderText="Fim"
                                locale="pt-br"
                            />
                            <Button
                                style={{ marginLeft: '10px' }}
                                onClick={aplicarFiltro}
                            >
                                Filtrar
                            </Button>
                        </div>

                        <Card className="p-3 shadow-sm" style={{ borderRadius: '15px' }}>
                            {listaManutencao.length > 0? (
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
