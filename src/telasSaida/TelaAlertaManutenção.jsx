import React, { useState } from 'react';
import { Button, Row, Col, Form, Container, Card } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import Pagina from '../templates/Pagina.jsx';
import fileDownload from 'js-file-download';
import './telacss.css';

export default function TelaAlertaManutencao(props) {
    const [filtro, setFiltro] = useState('');
    const [listaManutencao, setListaManutencao] = useState([
        {
            "placa": "ABC123",
            "manutencoes": [
                { "codigo": 1, "tipo": "P", "data": "2024-04-22", "observacoes": "Troca de óleo e filtros", "valor": 200 },
                { "codigo": 5, "tipo": "P", "data": "2024-06-20", "observacoes": "Verificação dos freios", "valor": 150 },
                { "codigo": 9, "tipo": "P", "data": "2024-08-05", "observacoes": "Troca de óleo e filtros", "valor": 200 }
            ]
        },
        {
            "placa": "DEF456",
            "manutencoes": [
                { "codigo": 3, "tipo": "P", "data": "2024-05-15", "observacoes": "Revisão do motor", "valor": 500 },
                { "codigo": 7, "tipo": "P", "data": "2024-07-10", "observacoes": "Troca de óleo e filtros", "valor": 200 }
            ]
        },
        {
            "placa": "GHI789",
            "manutencoes": [
                { "codigo": 4, "tipo": "C", "data": "2024-06-10", "observacoes": "Troca de filtros", "valor": 100 },
                { "codigo": 8, "tipo": "C", "data": "2024-07-20", "observacoes": "Reparo na parte elétrica", "valor": 300 }
            ]
        },
        {
            "placa": "XYZ789",
            "manutencoes": [
                { "codigo": 2, "tipo": "C", "data": "2024-05-05", "observacoes": "Substituição de pneus", "valor": 400 },
                { "codigo": 6, "tipo": "C", "data": "2024-07-01", "observacoes": "Reparo na suspensão", "valor": 350 },
                { "codigo": 10, "tipo": "C", "data": "2024-08-15", "observacoes": "Substituição de pneus", "valor": 400 }
            ]
        }
    ]);
    
    const [veiculosSelecionados, setVeiculosSelecionados] = useState([]);

    function handleButtonClick(index) {
        setVeiculosSelecionados(prev =>
            prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
        );
    }

    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
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
                            valorTotal += manut.valor; // Acumula o valor de cada manutenção
                            return (
                                <tr key={manut.codigo}>
                                    <td className="linhas-tabela">{manut.tipo === 'P' ? "Preventiva" : "Corretiva"}</td>
                                    <td className="linhas-tabela">{formatarData(manut.data)}</td>
                                    <td className="linhas-tabela">{manut.observacoes}</td>
                                    <td className="linhas-tabela">R${manut.valor.toFixed(2)}</td>
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

    function manipularMudancas(event) {
        setFiltro(event.target.value);
    }

    function listarVeiculos(veiculo, index) {
        if (filtro === "" || veiculo.placa.toLowerCase().includes(filtro.toLowerCase())) {
            return (
                <div key={veiculo.placa} style={{ width: '100%', marginTop: '10px' }}>
                    <Button
                        style={{ width: '100%' }}
                        variant={veiculosSelecionados.includes(index) ? "secondary" : "primary"}
                        onClick={() => handleButtonClick(index)}
                    >
                        {veiculo.placa}
                    </Button>
                    {veiculosSelecionados.includes(index) && listarManutencoes(veiculo.manutencoes)}
                </div>
            );
        }
    }

    const veiculosFiltrados = listaManutencao.filter(veiculo =>
        filtro === "" || veiculo.placa.toLowerCase().includes(filtro.toLowerCase())
    );

    function exportarParaWord() {
        let conteudo = 'Lista de Manutenções:\n\n';
        
        listaManutencao.forEach(veiculo => {
            conteudo += `Veículo: ${veiculo.placa}\n`;
            veiculo.manutencoes.forEach(manut => {
                conteudo += `  Tipo: ${manut.tipo === 'P' ? "Preventiva" : "Corretiva"}\n`;
                conteudo += `  Data: ${formatarData(manut.data)}\n`;
                conteudo += `  Observações: ${manut.observacoes}\n`;
                conteudo += `  Valor: R$${manut.valor.toFixed(2)}\n`;
                conteudo += '\n';
            });
            conteudo += '\n';
        });

        const blob = new Blob([conteudo], { type: 'application/msword' });
        fileDownload(blob, 'manutencoes.doc');
    }

    return (
        <Pagina>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div style={{ flex: '1' }}>
                                <Form.Control
                                    type="text"
                                    className="mb-3"
                                    style={{ borderRadius: '5px' }}
                                    placeholder="Pesquisar Veículo..."
                                    value={filtro}
                                    onChange={manipularMudancas}
                                />
                            </div>
                            <Button
                                style={{ marginLeft: '10px', marginTop: '-15px' }}
                                onClick={exportarParaWord}
                            >
                                Exportar para Word
                            </Button>
                        </div>

                        <Card className="p-3 shadow-sm" style={{ borderRadius: '15px' }}>
                            {veiculosFiltrados.length > 0 ? (
                                veiculosFiltrados.map((veiculo, index) => listarVeiculos(veiculo, index))
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
