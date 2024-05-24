import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { autenticarUsuario } from '../redux/usuarioReducer';

export default function TelaLogin() {
    const dispatch = useDispatch();
    const [credenciais, setCredenciais] = useState({ nome: '', senha: '', cpf: '' });
    const [autenticado, setAutenticado] = useState(false);
    const [erroAutenticacao, setErroAutenticacao] = useState('');

    async function handleLogin(event) {
        event.preventDefault();
        try {
            const retorno = await dispatch(autenticarUsuario(credenciais));
            if (retorno.payload.autenticado) {
                setAutenticado(true);
            } else {
                setErroAutenticacao('Usuário, CPF ou senha inválidos.');
            }
        } catch (error) {
            console.error('Erro ao autenticar usuário:', error);
            setErroAutenticacao('Erro ao autenticar usuário. Por favor, tente novamente mais tarde.');
        }
    }
    
    function formatarCPF(cpf) {
        if (!cpf) return cpf;
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.substring(0, 11);
        cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        return cpf;
    }

    function handleCpfChange(event) {
        const { name, value } = event.target;
        const cpfFormatado = formatarCPF(value);
        setCredenciais({ ...credenciais, [name]: cpfFormatado });
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setCredenciais({ ...credenciais, [name]: value });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <div className="login-form">
                        <h2 className="text-center mb-4">Login</h2>
                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId="formNome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" name="nome" value={credenciais.nome} onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group controlId="formSenha">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control type="password" name="senha" value={credenciais.senha} onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group controlId="formCpf">
                                <Form.Label>CPF</Form.Label>
                                <Form.Control type="text" name="cpf" value={credenciais.cpf} onChange={handleCpfChange} maxLength="14" />
                            </Form.Group>
                            <br />
                            <Button variant="primary" type="submit" className="btn-login">Login</Button>
                            {autenticado && <Navigate to="/menu" />}
                            {erroAutenticacao && <div className="text-danger mt-2">{erroAutenticacao}</div>}
                            <Link to="/esqueci-senha" className="d-block text-center mt-2">
                                Esqueci minha senha
                            </Link>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}