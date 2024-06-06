import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarManutencao, atualizarManutencao, buscarManutencoes } from '../../redux/manutencaoReducer';

const CadastroManutencao = (props) =>{
    const manutencaoVazia = {
        placa: '',
        tipo: 'preventiva',
        data: '',
        observacoes: ''
    };

    const estadoInicialManutencao = props.manutencaoParaEdicao || manutencaoVazia;
    const { setMostrarMensagem, setMensagem, setTipoMensagem } = props;
    const [manutencao, setManutencao] = useState(estadoInicialManutencao);
    const [formValidado, setFormValidado] = useState(false);
    const [camposRepetidos, setCamposRepetidos] = useState({
        placa: false
    });

    const { manutencoes } = useSelector((state) => state.manutencao);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(buscarManutencoes());
    }, [dispatch])

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        const { name, value } = componente;
        setManutencao({ ...manutencao, [name]: value });
    }

    async function verificarCamposRepetidos() {
        const camposRepetidosAtualizados = {
            placa: !!manutencoes.find(m => m.placa === manutencao.placa && m.id !== manutencao.id)
        };
        setCamposRepetidos(camposRepetidosAtualizados);
    }

    useEffect(() => {
        verificarCamposRepetidos();
    },[manutencao.placa])

    async function manipularSubmissao(e) {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        if (form.checkValidity()) {
            if (props.modoEdicao) {
                dispatch(atualizarManutencao(manutencao)).then((retorno) => {
                    setMostrarMensagem(true);
                    setMensagem(retorno.payload.mensagem);
                    setTipoMensagem(retorno.payload.status ? "success" : "danger");
                });
            } else {
                dispatch(adicionarManutencao(manutencao)).then((retorno) => {
                    setMostrarMensagem(true);
                    setMensagem(retorno.payload.mensagem);
                    setTipoMensagem(retorno.payload.status ? "success" : "danger");
                });
            }
            setFormValidado(false);
        } else {
            setFormValidado(true);
        }
    }

    return (
        <>
            <h2 className="text-center">{props.modoEdicao ? 'Alterar Manutenção' : 'Cadastrar Manutenção'}</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao} id='formManutencao'>
                <Form.Row>
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Placa(*):</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Placa"
                            id="placa"
                            name="placa"
                            value={manutencao.placa}
                            onChange={manipularMudancas}
                            required
                        />
                        {camposRepetidos.placa && <Form.Text className="text-danger">Esta placa já está em outra manutenção.</Form.Text>}
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Tipo(*):</Form.Label>
                        <Form.Control
                            as="select"
                            id="tipo"
                            name="tipo"
                            value={manutencao.tipo}
                            onChange={manipularMudancas}
                            required
                        >
                            <option>Preventiva</option>
                            <option>Corretiva</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Data(*):</Form.Label>
                        <Form.Control
                            type="date"
                            id="data"
                            name="data"
                            value={manutencao.data}
                            onChange={manipularMudancas}
                            required
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Group className="mb-3">
                    <Form.Label>Descrição:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        id="descricao"
                        name="descricao"
                        value={manutencao.descricao}
                        onChange={manipularMudancas}
                        required={manutencao.tipo === 'Corretiva'}
                    />
                </Form.Group>

                <p>(*) Campos obrigatórios</p>

                <Row>
                    <Col md={6} className="d-flex justify-content-end">
                        <Button type="submit" variant="primary">
                            {props.modoEdicao ? "Alterar" : "Cadastrar"}
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={() => props.exibirFormulario(false)}>
                            Voltar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default CadastroManutencao;