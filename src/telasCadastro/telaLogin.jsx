import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { autenticarUsuario } from '../redux/usuarioReducer'; // Importa a função de autenticação

export default function TelaLogin() {
    const dispatch = useDispatch();
    const [credenciais, setCredenciais] = useState({ nome: '', senha: '', cpf: '' });
    const [autenticado, setAutenticado] = useState(false);
    const [erroAutenticacao, setErroAutenticacao] = useState('');

    async function handleLogin(event) {
        event.preventDefault(); // Impede o comportamento padrão do formulário
        try {
            // Despacha a action para autenticar o usuário
            dispatch(autenticarUsuario(credenciais))
            .then((retorno) => {
                console.log(retorno, "bbbbb");
                if (retorno.payload.autenticado) {
                    console.log(retorno);
                    console.log(retorno.payload);
                    setAutenticado(true); // Define autenticado como true se a autenticação for bem-sucedida
                } else {
                    // Define a mensagem de erro de autenticação
                    setErroAutenticacao('Usuário, CPF ou senha inválidos.');
                }
            })
        } catch (error) {
            console.error('Erro ao autenticar usuário:', error);
            // Define a mensagem de erro de autenticação
            setErroAutenticacao('Erro ao autenticar usuário. Por favor, tente novamente mais tarde.');
        }
    }
    
    function formatarCPF(cpf) {
        if (!cpf) return cpf;
        // Remove todos os caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');
        // Limita o CPF a 11 dígitos
        cpf = cpf.substring(0, 11);
        // Aplica a máscara para CPF (xxx.xxx.xxx-xx)
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
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formNome" method="post" autoComplete="off">
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
                        <Button variant="primary" type="submit">Login</Button>
                        {autenticado && <Navigate to="/menu" />}
                        <br />
                        {erroAutenticacao && <div className="text-danger">{erroAutenticacao}</div>}
                        <Link to="/esqueci-senha" className="d-block text-center">
                            Esqueci minha senha
                        </Link>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}