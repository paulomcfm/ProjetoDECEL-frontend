import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { adicionarManutencao, atualizarManutencao } from '../../redux/manutencaoReducer';

export default function FormCadManutencao(props) {
    const { exibirFormulario, manutencaoParaEdicao, setManutencaoParaEdicao, modoEdicao, setMostrarMensagem, setMensagem, setTipoMensagem } = props;
    const [manutencao, setManutencao] = useState(manutencaoParaEdicao);
    const dispatch = useDispatch();

    useEffect(() => {
        setManutencao(manutencaoParaEdicao);
    }, [manutencaoParaEdicao]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setManutencao({ ...manutencao, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modoEdicao) {
            dispatch(atualizarManutencao(manutencao)).then((res) => {
                setMostrarMensagem(true);
                setMensagem(res.payload.mensagem);
                setTipoMensagem(res.payload.status ? "success" : "danger");
            });
        } else {
            dispatch(adicionarManutencao(manutencao)).then((res) => {
                setMostrarMensagem(true);
                setMensagem(res.payload.mensagem);
                setTipoMensagem(res.payload.status ? "success" : "danger");
            });
        }
        exibirFormulario(false);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Row>
                <Form.Group as={Col} controlId="formPlaca">
                    <Form.Label>Placa</Form.Label>
                    <Form.Control
                        type="text"
                        name="placa"
                        value={manutencao.placa}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="formTipo">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control
                        as="select"
                        name="tipo"
                        value={manutencao.tipo}
                        onChange={handleInputChange}
                        required
                    >
                        <option>Preventiva</option>
                        <option>Corretiva</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="formData">
                    <Form.Label>Data</Form.Label>
                    <Form.Control
                        type="date"
                        name="data"
                        value={manutencao.data}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
            </Form.Row>
            <Form.Group controlId="formDescricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="descricao"
                    value={manutencao.descricao}
                    onChange={handleInputChange}
                    required={manutencao.tipo === 'Corretiva'}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                {modoEdicao ? 'Atualizar' : 'Cadastrar'}
            </Button>
            <Button variant="secondary" onClick={() => exibirFormulario(false)} className="ml-2">
                Cancelar
            </Button>
        </Form>
    );
}