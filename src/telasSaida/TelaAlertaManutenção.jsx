import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import Pagina from '../templates/Pagina.jsx';
import './telacss.css'

export default function TelaAlertaManutencao(props) {
    const [filtro,setFiltro] = useState('')
    const [listaManutencao, setListaManutencao] = useState([
        {
            "placa": "ABC123",
            "manutencoes": [
                {
                    "codigo": 1,
                    "tipo": "P",
                    "data": "2024-04-22",
                    "observacoes": "Troca de óleo e filtros"
                },
                {
                    "codigo": 5,
                    "tipo": "P",
                    "data": "2024-06-20",
                    "observacoes": "Verificação dos freios"
                },
                {
                    "codigo": 9,
                    "tipo": "P",
                    "data": "2024-08-05",
                    "observacoes": "Troca de óleo e filtros"
                }
            ]
        },
        {
            "placa": "DEF456",
            "manutencoes": [
                {
                    "codigo": 3,
                    "tipo": "P",
                    "data": "2024-05-15",
                    "observacoes": "Revisão do motor"
                },
                {
                    "codigo": 7,
                    "tipo": "P",
                    "data": "2024-07-10",
                    "observacoes": "Troca de óleo e filtros"
                }
            ]
        },
        {
            "placa": "GHI789",
            "manutencoes": [
                {
                    "codigo": 4,
                    "tipo": "C",
                    "data": "2024-06-10",
                    "observacoes": "Troca de filtros"
                },
                {
                    "codigo": 8,
                    "tipo": "C",
                    "data": "2024-07-20",
                    "observacoes": "Reparo na parte elétrica"
                }
            ]
        },
        {
            "placa": "XYZ789",
            "manutencoes": [
                {
                    "codigo": 2,
                    "tipo": "C",
                    "data": "2024-05-05",
                    "observacoes": "Substituição de pneus"
                },
                {
                    "codigo": 6,
                    "tipo": "C",
                    "data": "2024-07-01",
                    "observacoes": "Reparo na suspensão"
                },
                {
                    "codigo": 10,
                    "tipo": "C",
                    "data": "2024-08-15",
                    "observacoes": "Substituição de pneus"
                }
            ]
        }
    ]);

    const [veiculosSelecionados, setVeiculosSelecionados] = useState([]);

    function handleButtonClick(index) {
        if (veiculosSelecionados.includes(index)) {
            setVeiculosSelecionados(veiculosSelecionados.filter(item => item !== index));
        } else {
            setVeiculosSelecionados([...veiculosSelecionados, index]);
        }
    }

    function listarManutencoes(manutencoes) {
        return (
            <CSSTransition
                in={veiculosSelecionados !== null}
                timeout={500}
                classNames="manutencoes"
                unmountOnExit
            >
                <table className="tabela" style={{ width: '100%' }}>
                    <thead className="head-tabela">
                        <tr>
                            <th className="linhas-titulo-tabela">Tipo</th>
                            <th className="linhas-titulo-tabela">Data</th>
                            <th className="linhas-titulo-tabela">Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {manutencoes.map(manut => (
                            <tr key={manut.codigo}>
                                <td className="linhas-tabela">{manut.tipo === 'P' ? "Preventiva" : "Corretiva"}</td>
                                <td className="linhas-tabela">{manut.data}</td>
                                <td className="linhas-tabela">{manut.observacoes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CSSTransition>
        );
    }

    function manipularMudancas(event) {
        const { value } = event.target;
        setFiltro(value);
    }

    function listarVeiculos(veiculo, index) {
        return (
            <div key={veiculo.placa} style={{ width: '100%', marginTop: '2px' }}>
                <Button style={{ width: '100%' }} onClick={() => handleButtonClick(index)}>
                    {veiculo.placa}
                </Button>
                {veiculosSelecionados.includes(index) && listarManutencoes(veiculo.manutencoes)}
            </div>
        );
    }

    return (
        <Pagina>
            <Row className="justify-content-center align-items-center" style={{ marginTop: '10%' }}>
                <Col>
                    <input type="text" id="nome" className="form-control mb-3 mx-auto" placeholder="Pesquisar Rota..." style={{ width: '400px' }} name="nome" onChange={manipularMudancas} />
                </Col>
            </Row>
            <Row className="justify-content-center align-items-center" style={{ marginTop: '5%' }}>
                <Col>
                    {listaManutencao.map((veiculo, index) => (
                        listarVeiculos(veiculo, index)
                    ))}
                </Col>
            </Row>
        </Pagina>
    );
}