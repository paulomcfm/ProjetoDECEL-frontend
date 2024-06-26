import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { buscarUsuarios, atualizarUsuario } from '../redux/usuarioReducer';

export default function EditarUsuario(){
    const usuarioLogado = useSelector((state) => state.usuario);
    const { estado, mensagem, usuarios} = useSelector((state) => state.usuario)
    const [formValidado, setFormValidado] = useState(false);
    const dispatch = useDispatch();
    const [erro, setErro] = useState(false);
    const [usuario, setUsuario] = useState({
        nome: '',
        senha: '',
        cpf:'',
        email:'',
        celular: ''
    });
    let usuarioExistente;

    useEffect(() => {
        dispatch(buscarUsuarios());
    }, [dispatch]);

    useEffect(() => {
        setUsuario({
            nome: usuarioLogado.nome,
            senha: usuarioLogado.senha,
            cpf: usuarioLogado.cpf,
            email: usuarioLogado.email,
            celular: usuarioLogado.celular
        });
    }, [usuarioLogado]);


    function manipularMudancas(e) {
        const componente = e.currentTarget;
        let valor = componente.value;
        if (componente.name === 'celular') {
            valor = formatarCelular(valor);
        }
        setUsuario({ ...usuario, [componente.name]: componente.value });
    }

    async function handleInputChange(event) {
        const { name, value } = event.target;
        if (name === 'celular') {
            const celular = formatarCelular(value);
            setUsuario(prevUsuario => ({
                ...prevUsuario,
                celular: celular
            }));
        }
    }

    function formatarCelular(celular) {
        if (!celular) return celular;
        // Remove todos os caracteres não numéricos
        celular = celular.replace(/\D/g, '');
        // Aplica a máscara para celular (xx) 9xxxx-xxxx
        celular = celular.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        return celular;
    }

    function manipularSubmissao(e) {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        if (form.checkValidity() && validarCelular(usuario.celular)) {
            usuarioExistente = usuarios.find(u => u.nome === usuario.nome || u.cpf === usuario.cpf || u.email === usuario.email || 
                u.celular === usuario.celular);
            if (usuarioExistente && !props.modoEdicao) {
                setErro(true);
            }
            else
            {
                dispatch(atualizarUsuario(usuario)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Usuário alterado com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                    } else {
                        props.setMensagem('Usuário não alterado!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            }
            setFormValidado(false);
        } else {
            setFormValidado(true);
        }
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center">Editar Usuário</h2>
                    <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                        <Form.Group className="mb-3">
                        <Form.Label>Nome completo:</Form.Label>
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
                            <Form.Label>Senha:</Form.Label>
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
                        <p>A senha pode conter letras minúsculas e maiúsculas, números e símbolos</p>
                        <Form.Group className="mb-3">
                            <Form.Label>CPF:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="999.999.999-99"
                                id="cpf"
                                name="cpf"
                                value={usuario.cpf}
                                maxLength="14"
                                disabled/>
                            <Form.Control.Feedback type="invalid">
                                CPF inválido.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>E-mail:</Form.Label>
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
                            <Form.Label>Celular:</Form.Label>
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
                        </Form.Group>
                        <Button variant="primary" type="submit">Alterar</Button>
                    </Form>
                </Col>
            </Row>
            {!erro ? "" : <div>
                    <Form.Label>
                        <p> O campo {usuarioExistente.nome === usuario.nome ? 'Nome' : usuarioExistente.rg === usuario.rg ? 'RG' : usuarioExistente.cpf === usuario.cpf ? 'CPF' : 
                    usuarioExistente.email === usuario.email ? 'E-mail' : 'Celular'} já está/estão em uso. </p>
                    </Form.Label>
                </div>}
        </Container>
    );
}