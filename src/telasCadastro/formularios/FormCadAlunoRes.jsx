import { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { adicionarAluno, atualizarAluno } from '../../redux/alunoReducer';
import { useSelector, useDispatch } from 'react-redux';

export default function FormCadAlunos(props) {

    const alunoVazio = {
        nome: '',
        rg: '',
        observacoes: '',
        dataNasc: ''
    }

    const estadoInicialAluno = props.alunoParaEdicao;
    const [aluno, setAluno] = useState(estadoInicialAluno);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, alunos } = useSelector((state) => state.aluno);
    const dispatch = useDispatch();

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setAluno({ ...aluno, [componente.name]: componente.value });
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                dispatch(adicionarAluno(aluno));
                props.setMensagem('Aluno incluído com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
            }
            else {
                dispatch(atualizarAluno(aluno));
                props.setMensagem('Aluno alterado com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
                props.setModoEdicao(false);
                props.setAlunoParaEdicao(alunoVazio);
            }
            setAluno(alunoVazio);
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
            <h2 className="text-center">Cadastrar Aluno</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome"
                        id="nome"
                        name="nome"
                        value={aluno.nome}
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
                        value={aluno.rg}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Data de Nascimento:</Form.Label>
                    <Form.Control
                        type="date"
                        id="dataNasc"
                        name="dataNasc"
                        value={aluno.dataNasc}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Observações:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Observações"
                        id="observacoes"
                        name="observacoes"
                        value={aluno.observacoes}
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
