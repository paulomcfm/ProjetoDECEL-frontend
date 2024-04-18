import { useState, useEffect } from 'react';
import { Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarUsuario, atualizarUsuario } from '../../redux/usuarioReducer';
import { buscarAlunos } from '../../redux/alunoReducer';
import InputMask from 'react-input-mask';
import validarCelular from '../../validacoes/validarCelular';
import validarCPF from '../../validacoes/validarCpf';
import validarRG from '../../validacoes/validarRG';

export default function FormCadUsuario(props) {
    const usuarioVazio = {
        nome: '',
        rg: '',
        cpf: '',
        email: '',
        celular: '',
        categoria: 'educacao' // Defina o valor padrão para a categoria aqui
    };

    const estadoInicialUsuario = props.usuarioParaEdicao;
    const [usuario, setUsuario] = useState(estadoInicialUsuario);
    const [formValidado, setFormValidado] = useState(false);
    const { estadoAlu, mensagemAlu, alunos } = useSelector((state) => state.aluno);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarAlunos());
    }, [dispatch]);

    function manipularMudancas(e) {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    }

    function manipularSubmissao(e) {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        if (form.checkValidity() && validarCelular(usuario.celular) && validarRG(usuario.rg) && validarCPF(usuario.cpf)) {
            if (!props.modoEdicao) {
                dispatch(adicionarUsuario(usuario)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Usuário incluído com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                    } else {
                        props.setMensagem('Usuário não incluído!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            } else {
                dispatch(atualizarUsuario(usuario)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Usuário alterado com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        props.setModoEdicao(false);
                        props.setUsuarioParaEdicao(usuarioVazio);
                    } else {
                        props.setMensagem('Usuário não alterado!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            }

            setUsuario(usuarioVazio);
            setFormValidado(false);
        } else {
            setFormValidado(true);
        }
    }

    return (
        <>
            <h2 className="text-center">{props.modoEdicao ? 'Alterar Usuário' : 'Cadastrar Usuário'}</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao} id='formUsuario'>
                <Form.Group className="mb-3">
                    <Form.Label>Nome completo(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome"
                        id="nome"
                        name="nome"
                        value={usuario.nome}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>RG(*):</Form.Label>
                    <InputMask
                        mask="99.999.999-9" // Máscara para o RG
                        maskChar="_"
                        placeholder="XX.XXX.XXX-X"
                        id="rg"
                        name="rg"
                        value={usuario.rg}
                        onChange={manipularMudancas}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        RG inválido.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>CPF(*):</Form.Label>
                    <InputMask
                        mask="999.999.999-99" // Máscara para o CPF
                        maskChar="_"
                        placeholder="XXX.XXX.XXX-XX"
                        id="cpf"
                        name="cpf"
                        value={usuario.cpf}
                        onChange={manipularMudancas}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        CPF inválido.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>E-mail(*):</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="E-mail"
                        id="email"
                        name="email"
                        value={usuario.email}
                        onChange={manipularMudancas}
                        required
                        pattern="\S+@\S+\.\S+"
                    />
                    <Form.Control.Feedback type="invalid">
                        E-mail inválido.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Celular(*):</Form.Label>
                    <InputMask
                        mask="(99) 99999-9999" // Máscara para o telefone
                        maskChar="_"
                        placeholder="(99) 99999-9999"
                        id="celular"
                        name="celular"
                        value={usuario.celular}
                        onChange={manipularMudancas}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Celular inválido.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Categoria(*):</Form.Label>
                    <Form.Select
                        id="categoria"
                        name="categoria"
                        value={usuario.categoria}
                        onChange={manipularMudancas}
                        required
                    >
                        <option value="educacao">Educação</option>
                        <option value="transporte">Transporte</option>
                    </Form.Select>
                </Form.Group>

                <p>(*) Campos obrigatórios</p>
                
                <Row>
                    <Col md={6} offset={5} className="d-flex justify-content-end">
                        <Button type="submit" variant="primary">
                            {props.modoEdicao ? "Alterar" : "Cadastrar"}
                        </Button>
                    </Col>
                    <Col>
                        <Button type="submit" variant="danger" onClick={() => props.exibirFormulario(false)}>
                            Voltar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
