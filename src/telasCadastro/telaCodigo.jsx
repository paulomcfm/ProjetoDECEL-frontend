import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { redefinirSenha } from '../redux/usuarioReducer.js';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function TelaCodigo() {
    const [codigo, setCodigo] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/esqueci');
        return null; // or a loading indicator
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const resposta = dispatch(redefinirSenha({ email, codigo, novaSenha }));
        setMensagem(resposta.payload.mensagem);
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCodigo">
                    <Form.Label>Código de Redefinição</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your reset code"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formNovaSenha">
                    <Form.Label>Nova Senha</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your new password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Redefinir Senha
                </Button>
            </Form>
            {mensagem && <Alert variant="info">{mensagem}</Alert>}
            <br />
            {mensagem && <Link to="/" className="d-block text-center">Voltar para o Login</Link>}
        </Container>
    );
}
