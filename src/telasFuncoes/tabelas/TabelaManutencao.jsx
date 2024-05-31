import React, { useState, useEffect } from 'react';
import { Container, Form, Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarManutencoes } from '../../redux/manutencaoReducer';

export default function TabelaManutencoes(props) {
    const { manutencoes } = useSelector(state => state.manutencao);
    const [termoBusca, setTermoBusca] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarManutencoes());
    }, [dispatch]);

    const manutencoesFiltradas = manutencoes.filter(manutencao =>
        manutencao.placa.includes(termoBusca)
    );

    const editarManutencao = (manutencao) => {
        props.setManutencaoParaEdicao(manutencao);
        props.setModoEdicao(true);
        props.exibirFormulario(true);
    };

    return (
        <Container className="mt-4">
            <Form>
                <Form.Group controlId="buscarManutencao">
                    <Form.Label>Buscar Manutenção por Placa:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite a placa do veículo"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </Form.Group>
            </Form>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Placa</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {manutencoesFiltradas.map((manutencao, index) => (
                        <tr key={index}>
                            <td>{manutencao.placa}</td>
                            <td>{manutencao.tipo}</td>
                            <td>{manutencao.data}</td>
                            <td>{manutencao.descricao}</td>
                            <td>
                                <Button variant="warning" onClick={() => editarManutencao(manutencao)}>
                                    Editar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button
                variant="primary"
                className="mt-3"
                onClick={() => {
                    props.setManutencaoParaEdicao({
                        placa: '',
                        tipo: '',
                        data: '',
                        descricao: ''
                    });
                    props.setModoEdicao(false);
                    props.exibirFormulario(true);
                }}
            >
                Cadastrar Manutenção
            </Button>
        </Container>
    );
}