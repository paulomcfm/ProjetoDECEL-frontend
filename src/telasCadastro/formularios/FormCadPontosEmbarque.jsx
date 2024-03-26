import { useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import { adicionarPontoEmbarque, atualizarPontoEmbarque } from '../../redux/pontosEmbarqueReducer';
import { useSelector, useDispatch } from 'react-redux';

export default function FormCadPontosEmbarque(props) {

    const pontosEmbarqueVazio = {
        endereco: ''
    }

    const estadoInicialPontoEmbarque = props.pontoEmbarqueParaEdicao
    const [pontoEmbarque, setPontoEmbarque] = useState(estadoInicialPontoEmbarque);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, pontosEmbarque } = useSelector((state) => state.pontoEmbarque);
    const dispatch = useDispatch();

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setPontoEmbarque({ ...pontoEmbarque, [componente.name]: componente.value });
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                dispatch(adicionarPontoEmbarque(pontoEmbarque));
                props.setMensagem('Ponto de embarque incluída com sucesso');
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
            setFormValidado(false);
        }
        else {
            setFormValidado(true);
        }

        e.stopPropagation();
        e.preventDefault();
    }


    return (
        <>
            <h2 className="text-center">Cadastrar Ponto de Embarque</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Form.Group className="mb-3">
                    <Form.Label>Endereço:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Endereço"
                        id="endereco"
                        name="endereco"
                        value={pontoEmbarque.endereco}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

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
