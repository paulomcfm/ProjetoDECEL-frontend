import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarVeiculo, atualizarVeiculo, buscarVeiculos } from '../../redux/veiculoReducer';

export default function FormCadVeiculo(props) {
    const veiculoVazio = {
        codigo: '0',
        renavam: '',
        placa: '',
        modelo: '',
        capacidade: 0,
        tipo: ''
    };

    const estadoInicialVeiculo = props.veiculoParaEdicao || veiculoVazio;
    const [veiculo, setVeiculo] = useState(estadoInicialVeiculo);
    const [formValidado, setFormValidado] = useState(false);
    const { veiculos } = useSelector((state) => state.veiculo);
    const dispatch = useDispatch();
    const [camposRepetidos, setCamposRepetidos] = useState({
        renavam: false,
        placa: false,
    });

    useEffect(() => {
        dispatch(buscarVeiculos());
    }, [dispatch]);

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        let valor = componente.value.toUpperCase(); // Placa in uppercase
        setVeiculo({ ...veiculo, [componente.name]: valor });
    }

    async function verificarCamposRepetidos() {
        const camposRepetidosAtualizados = {
            renavam: !!veiculos.find(v => v.renavam === veiculo.renavam && v.codigo !== veiculo.codigo),
            placa: !!veiculos.find(v => v.placa === veiculo.placa && v.codigo !== veiculo.codigo),
        };
        setCamposRepetidos(camposRepetidosAtualizados);
    }

    useEffect(() => {
        verificarCamposRepetidos();
    }, [veiculo.renavam, veiculo.placa]);

    function validarPlaca(placa) {
        const regexPlaca = /^[A-Z]{3}[0-9]{4}$/;
        return regexPlaca.test(placa);
    }

    function validarRenavam(renavam) {
        return renavam.length === 11;
    }

    async function manipularSubmissao(e) {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        if (form.checkValidity() && validarPlaca(veiculo.placa) && validarRenavam(veiculo.renavam)) {
            if (!props.modoEdicao) {
                dispatch(adicionarVeiculo(veiculo)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Veículo incluído com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        props.exibirFormulario(false);
                    } else {
                        props.setMensagem('Veículo não incluído!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            } else {
                dispatch(atualizarVeiculo(veiculo)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Veículo alterado com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        props.setModoEdicao(false);
                        props.setVeiculoParaEdicao(veiculoVazio);
                        props.exibirFormulario(false);
                    } else {
                        props.setMensagem('Veículo não alterado!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            }
            setVeiculo(veiculoVazio);
            setFormValidado(false);
        } else if (!validarPlaca(veiculo.placa) || !validarRenavam(veiculo.renavam)) {
            alert("Placa ou Renavam inválidos");
        } else {
            setFormValidado(true);
        }
    }

    return (
        <>
            <h2 className="text-center">{props.modoEdicao ? 'Alterar Veículo' : 'Cadastrar Veículo'}</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao} id='formVeiculo'>
                <Form.Group className="mb-3">
                    <Form.Label>Renavam(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Renavam"
                        id="renavam"
                        name="renavam"
                        value={veiculo.renavam}
                        onChange={manipularMudancas}
                        required
                        maxLength="11"
                    />
                    <Form.Control.Feedback type="invalid">
                        Renavam inválido.
                    </Form.Control.Feedback>
                    {camposRepetidos.renavam && <Form.Text className="text-danger">Este Renavam já está em uso.</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Placa(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="AAA0000"
                        id="placa"
                        name="placa"
                        value={veiculo.placa}
                        onChange={manipularMudancas}
                        required
                        maxLength="7"
                    />
                    <Form.Control.Feedback type="invalid">
                        Placa inválida.
                    </Form.Control.Feedback>
                    {camposRepetidos.placa && <Form.Text className="text-danger">Esta placa já está em uso.</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Modelo(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Modelo"
                        id="modelo"
                        name="modelo"
                        value={veiculo.modelo}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Capacidade(*):</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Capacidade"
                        id="capacidade"
                        name="capacidade"
                        value={veiculo.capacidade}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tipo(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tipo"
                        id="tipo"
                        name="tipo"
                        value={veiculo.tipo}
                        onChange={manipularMudancas}
                        required
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