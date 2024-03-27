import { useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import { adicionarEscola, atualizarEscola } from '../../redux/escolaReducer';
import { useSelector, useDispatch } from 'react-redux';

export default function FormCadEscolas(props) {

    const escolaVazia = {
        nome: '',
        endereco: '',
        tipo: ''
    }

    const estadoInicialEscola = props.escolaParaEdicao;
    const [escola, setEscola] = useState(estadoInicialEscola);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, escolas } = useSelector((state) => state.escola);
    const dispatch = useDispatch();

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setEscola({ ...escola, [componente.name]: componente.value });
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                dispatch(adicionarEscola(escola));
                props.setMensagem('Escola incluída com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
            }
            else {
                dispatch(atualizarEscola(escola));
                props.setMensagem('Escola alterada com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
                props.setModoEdicao(false);
                props.setEscolaParaEdicao(escolaVazia);
            }
            setEscola(escolaVazia);
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
            <h2 className="text-center">Cadastrar Escola</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome"
                        id="nome"
                        name="nome"
                        value={escola.nome}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Endereço(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Endereço"
                        id="endereco"
                        name="endereco"
                        value={escola.endereco}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Selecione o tipo de escola(*):</Form.Label>
                    <Form.Select aria-label="Selecione..."
                        id='tipo'
                        name='tipo'
                        onChange={manipularMudancas}
                        value={escola.tipo}
                        required>
                        <option value="">Selecione...</option>
                        <option value='i'>Educação Infantil</option>
                        <option value='f'>Ensino Fundamental</option>
                        <option value='a'>Ambos</option>
                    </Form.Select>
                </Form.Group>
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
