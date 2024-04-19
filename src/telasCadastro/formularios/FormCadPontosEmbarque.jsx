import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { adicionarPontoEmbarque, atualizarPontoEmbarque } from '../../redux/pontosEmbarqueReducer';
import { useSelector, useDispatch } from 'react-redux';

export default function FormCadPontosEmbarque(props) {
    const pontosEmbarqueVazio = {
        codigo: 0,
        rua: '',
        numero: '',
        bairro: '',
        cep: ''
    }

    const estadoInicialPontoEmbarque = props.pontoEmbarqueParaEdicao;
    const [pontoEmbarque, setPontoEmbarque] = useState(estadoInicialPontoEmbarque);
    const [cepRaw, setCepRaw] = useState('');
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, pontosEmbarque } = useSelector((state) => state.pontoEmbarque);
    const dispatch = useDispatch();

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setPontoEmbarque({ ...pontoEmbarque, [componente.name]: componente.value });
    }

    async function manipularMudancasCEP(event) {
        let cep = String(event.target.value);
        cep = cep.replace(/\D/g, '');
        setCepRaw(cep);

        if (cep.length === 8) {
            const enderecoData = await consultarCEP(cep);
            if (enderecoData) {
                setPontoEmbarque({
                    ...pontoEmbarque,
                    rua: enderecoData.logradouro || '',
                    bairro: enderecoData.bairro || '',
                    cidade: enderecoData.localidade || ''
                });
            }
        }
    }

    function formatarCEP(cep) {
        cep = cep.replace(/\D/g, '');

        if (cep.length >= 5) {
            cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
        }

        return cep;
    }

    async function consultarCEP(cep) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao consultar o CEP:', error);
            return null;
        }
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (cepRaw) {
            pontoEmbarque.cep = cepRaw;
            if (form.checkValidity()) {
                if (!props.modoEdicao) {
                    dispatch(adicionarPontoEmbarque(pontoEmbarque));
                    props.setMensagem('Ponto de embarque incluído com sucesso');
                    props.setTipoMensagem('success');
                    props.setMostrarMensagem(true);
                }
                else {
                    dispatch(atualizarPontoEmbarque(pontoEmbarque));
                    props.setMensagem('Ponto de embarque alterado com sucesso');
                    props.setTipoMensagem('success');
                    props.setMostrarMensagem(true);
                    props.setModoEdicao(false);
                    props.setPontoEmbarqueParaEdicao(pontosEmbarqueVazio);
                }
                setPontoEmbarque(pontosEmbarqueVazio);
                setCepRaw('');
                setFormValidado(false);
            }
            else {
                setFormValidado(true);
            }
        }
        else {
            console.error("Por favor, informe o CEP");
        }

        e.stopPropagation();
        e.preventDefault();
    }

    useEffect(() => {
        if (props.modoEdicao) {
            setCepRaw(pontoEmbarque.cep);
        }
    }, [props.modoEdicao, pontoEmbarque.cep]);

    return (
        <>
            <h2 className="text-center">Cadastrar Ponto de Embarque</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Row>
                    <Col md={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>CEP(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="XXXXX-XXX"
                                id="cep"
                                name="cep"
                                value={formatarCEP(cepRaw)}
                                onChange={manipularMudancasCEP}
                                maxLength="9"
                                required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rua(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Rua"
                                id="rua"
                                name="rua"
                                value={pontoEmbarque.rua}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Form.Group className="mb-3">
                            <Form.Label>Número(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Número"
                                id="numero"
                                name="numero"
                                value={pontoEmbarque.numero}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Bairro(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Bairro"
                                id="bairro"
                                name="bairro"
                                value={pontoEmbarque.bairro}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                </Row>

                <p>(*) Campos obrigatórios</p>
                <Row className="justify-content-end">
                    <div className="d-flex justify-content-center">
                        <Button type="submit" variant="primary">
                            {props.modoEdicao ? "Alterar" : "Cadastrar"}
                        </Button>
                        <Button type="submit" variant="danger" className="ms-2" onClick={() => props.exibirFormulario(false)}>
                            Voltar
                        </Button>
                    </div>
                </Row>
            </Form>
        </>
    );
}
