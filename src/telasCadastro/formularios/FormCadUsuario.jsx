import { useState, useEffect } from 'react';
import { Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarUsuario, atualizarUsuario, buscarUsuarios } from '../../redux/usuarioReducer';
import InputMask from 'react-input-mask';
import validarCelular from '../../validacoes/validarCelular';
import validarCPF from '../../validacoes/validarCpf';

export default function FormCadUsuario(props) {
    const usuarioVazio = {
        nome: '',
        senha: '',
        cpf: '',
        email: '',
        celular: ''
    };

    const estadoInicialUsuario = props.usuarioParaEdicao;
    const [usuario, setUsuario] = useState(estadoInicialUsuario);
    const [formValidado, setFormValidado] = useState(false);
    const [erro, setErro] = useState(false);
    const { estadoUsu, mensagemUsu, usuarios } = useSelector((state) => state.usuario);
    const dispatch = useDispatch();
    const usuarioExistente = null;

    useEffect(() => {
        dispatch(buscarUsuarios());
    }, [dispatch]);

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        let valor = componente.value;
        if (componente.name === 'celular') {
            valor = formatarCelular(valor);
        } else if(componente.name === 'cpf'){
            valor = formatarCPF(valor);
        }
        setUsuario({ ...usuario, [componente.name]: componente.value });
    }

    function manipularSubmissao(e) {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        if (form.checkValidity() && validarCelular(usuario.celular) && validarCPF(usuario.cpf)) {
            usuarioExistente = usuarios.find(u => u.nome === usuario.nome || u.cpf === usuario.cpf || u.email === usuario.email || 
                u.celular === usuario.celular);
            if (usuarioExistente) {
                setErro(true);
            }
            else {
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
            }
            setUsuario(usuarioVazio);
            setFormValidado(false);
        } else {
            setFormValidado(true);
        }
    }
    
    function formatarCelular(celular) {
        if (!celular) return celular;
        // Remove todos os caracteres não numéricos
        celular = celular.replace(/\D/g, '');
        // Verifica se o celular possui 11 dígitos (incluindo DDD) e aplica a máscara correta
        if (celular.length === 11) {
            celular = celular.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else {
            // Se não possuir 11 dígitos, assume que é um telefone fixo e aplica a máscara para telefone fixo
            celular = celular.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
        return celular;
    }
    
    function formatarCPF(cpf) {
        if (!cpf) return cpf;
        // Remove todos os caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');
        // Aplica a máscara para CPF (xxx.xxx.xxx-xx)
        cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        return cpf;
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
                    <Form.Label>Senha(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Senha"
                        id="senha"
                        name="senha"
                        value={usuario.senha}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>
                <p>Pode conter letras minúsculas e maiúsculas, números e símbolos</p>
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
               {erro && <div>
                    <Form.Label>
                        <p> O campo {usuarioExistente.nome === usuario.nome ? 'Nome' : usuarioExistente.rg === usuario.rg ? 'RG' : usuarioExistente.cpf === usuario.cpf ? 'CPF' : 
                    usuarioExistente.email === usuario.email ? 'E-mail' : 'Celular'} já está/estão em uso. </p>
                    </Form.Label>
                </div>}
            </Form>
        </>
    );
}
