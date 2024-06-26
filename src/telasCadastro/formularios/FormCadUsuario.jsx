import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarUsuario, atualizarUsuario, buscarUsuarios } from '../../redux/usuarioReducer';
import validarCelular from '../../validacoes/validarCelular';
import validarCPF from '../../validacoes/validarCpf';

export default function FormCadUsuario(props) {
    const usuarioVazio = {
        nome: '',
        senha: '',
        cpf: '',
        email: '',
        celular: '',
        nivel: ''
    };

    const estadoInicialUsuario = props.usuarioParaEdicao || usuarioVazio;
    const [usuario, setUsuario] = useState(estadoInicialUsuario);
    const [formValidado, setFormValidado] = useState(false);
    const { usuarios } = useSelector((state) => state.usuario);
    const dispatch = useDispatch();
    const [camposRepetidos, setCamposRepetidos] = useState({
        nome: false,
        cpf: false,
        email: false,
        celular: false,
    });

    useEffect(() => {
        dispatch(buscarUsuarios());
    }, [dispatch]);

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        let valor = componente.value;
        if (componente.name === 'celular') {
            valor = formatarCelular(valor);
        } else if (componente.name === 'cpf') {
            valor = formatarCPF(valor);
        }
        setUsuario({ ...usuario, [componente.name]: valor });
    }

    async function handleInputChange(event) {
        const { name, value } = event.target;

        // Atualiza o estado do usuário com o valor formatado do CPF ou celular
        if (name === 'cpf') {
            const cpf = formatarCPF(value);
            setUsuario(prevUsuario => ({
                ...prevUsuario,
                cpf: cpf
            }));
        } else if (name === 'celular') {
            const celular = formatarCelular(value);
            setUsuario(prevUsuario => ({
                ...prevUsuario,
                celular: celular
            }));
        }
    }

    async function verificarCamposRepetidos() {
        const camposRepetidosAtualizados = {
            nome: !!usuarios.find(u => u.nome === usuario.nome && u.cpf !== usuario.cpf),
            cpf: !!usuarios.find(u => u.cpf === usuario.cpf),
            email: !!usuarios.find(u => u.email === usuario.email && u.cpf !== usuario.cpf),
            celular: !!usuarios.find(u => u.celular === usuario.celular && u.cpf !== usuario.cpf),
        };
        setCamposRepetidos(camposRepetidosAtualizados);
    }

    useEffect(() => {
        verificarCamposRepetidos();
    }, [usuario.nome, usuario.cpf, usuario.email, usuario.celular]);

    function formatarCPF(cpf) {
        if (!cpf) return cpf;
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        return cpf;
    }

    function formatarCelular(celular) {
        if (!celular) return celular;
        celular = celular.replace(/\D/g, '');
        if (celular.length === 11) {
            celular = celular.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else {
            celular = celular.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
        return celular;
    }

    async function manipularSubmissao(e) {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        if (form.checkValidity() && validarCelular(usuario.celular) && validarCPF(usuario.cpf)) {
            if (!props.modoEdicao) {
                dispatch(adicionarUsuario(usuario)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Usuário incluído com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        props.exibirFormulario(false)
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
                        props.exibirFormulario(false)
                    } else {
                        props.setMensagem('Usuário não alterado!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            }
            setUsuario(usuarioVazio);
            setFormValidado(false);
        } else if (!validarCelular(usuario.celular) || !validarCPF(usuario.cpf)) {
            alert("Celular ou CPF inválidos");
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
                    {camposRepetidos.nome && <Form.Text className="text-danger">Este nome já está em uso.</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Senha(*):</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Senha"
                        id="senha"
                        name="senha"
                        value={usuario.senha}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>
                <p>A senha pode conter letras minúsculas e maiúsculas, números e símbolos</p>

                <Form.Group className="mb-3">
                    <Form.Label>CPF(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="999.999.999-99"
                        id="cpf"
                        name="cpf"
                        value={usuario.cpf}
                        onChange={handleInputChange}
                        maxLength="14"
                        required
                        disabled={props.modoEdicao}
                    />
                    <Form.Control.Feedback type="invalid">
                        CPF inválido.
                    </Form.Control.Feedback>
                    {!props.modoEdicao && camposRepetidos.cpf && <Form.Text className="text-danger">Este CPF já está em uso.</Form.Text>}
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
                    {camposRepetidos.email && <Form.Text className="text-danger">Este e-mail já está em uso.</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Celular(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="(00) 00000-0000"
                        id="celular"
                        name="celular"
                        value={usuario.celular}
                        onChange={handleInputChange}
                        maxLength="15"
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Celular inválido.
                    </Form.Control.Feedback>
                    {camposRepetidos.celular && <Form.Text className="text-danger">Este celular já está em uso.</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nível(*):</Form.Label>
                    <div>
                        <Form.Check
                            inline
                            label="Administrador"
                            type="radio"
                            id="nivel-administrador"
                            name="nivel"
                            value="administrador"
                            checked={usuario.nivel === 'administrador'}
                            onChange={manipularMudancas}
                            required
                        />
                        <Form.Check
                            inline
                            label="Normal"
                            type="radio"
                            id="nivel-normal"
                            name="nivel"
                            value="normal"
                            checked={usuario.nivel === 'normal'}
                            onChange={manipularMudancas}
                            required
                        />
                    </div>
                    <Form.Control.Feedback type="invalid">
                        Por favor, selecione um nível.
                    </Form.Control.Feedback>
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
