import { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { adicionarResponsavel, atualizarResponsavel } from '../../redux/responsavelReducer';
import { useSelector, useDispatch } from 'react-redux';

export default function FormCadResponsavel(props) {

    const responsavelVazio = {
        nome: '',
        rg: '',
        cpf: '',
        email: '',
        telefone: '',
        celular: ''
    }

    const estadoInicialResponsavel = props.responsavelParaEdicao;
    const [responsavel, setResponsavel] = useState(estadoInicialResponsavel);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, responsaveis } = useSelector((state) => state.responsavel);
    const dispatch = useDispatch();

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setResponsavel({ ...responsavel, [componente.name]: componente.value });
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                dispatch(adicionarResponsavel(responsavel));
                props.setMensagem('Responsável incluído com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
            }
            else {
                dispatch(atualizarResponsavel(responsavel));
                props.setMensagem('Responsável alterado com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
                props.setModoEdicao(false);
                props.setResponsavelParaEdicao(responsavelVazio);
            }
            setResponsavel(responsavelVazio);
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
            <h2 className="text-center">Cadastrar Responsável</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome"
                        id="nome"
                        name="nome"
                        value={responsavel.nome}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>RG:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="RG"
                        id="rg"
                        name="rg"
                        value={responsavel.rg}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>CPF:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="CPF"
                        id="cpf"
                        name="cpf"
                        value={responsavel.cpf}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>E-mail:</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="E-mail"
                        id="email"
                        name="email"
                        value={responsavel.email}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Telefone:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Telefone"
                        id="telefone"
                        name="telefone"
                        value={responsavel.telefone}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Celular:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Celular"
                        id="celular"
                        name="celular"
                        value={responsavel.celular}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>
                
                <Row>
                    <Col md={6} offset={5} className="d-flex justify-content-end">
                        <Button type="submit" variant={"primary"} onClick={() => {
                        }}>{props.modoEdicao ? "Alterar" : "Cadastrar"}</Button>
                    </Col>
                    <Col>
                        <Button type="submit" variant={"danger"} onClick={() => {
                            props.exibirFormulario(false);
                        }}>Voltar</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
