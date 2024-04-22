import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import TelaMenu from './TelaMenu';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function autenticarUsuario(username, password) {
    // Lógica de autenticação aqui
    return true; // ou false, dependendo do sucesso da autenticação
}

export default function TelaLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [autenticado, setAutenticado] = useState(false);

    function handleLogin() {
        // Lógica de autenticação
        const autenticacaoSucesso = autenticarUsuario(username, password, cpf);
        if (autenticacaoSucesso) {
            setAutenticado(true);
        } else {
            // Tratamento para autenticação inválida
            alert('Usuário ou senha inválidos.');
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mb-4">Login</h2>
                    <Form>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Nome de Usuário</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome de Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>CPF</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="999.999.999-99"
                                id="cpf"
                                name="cpf"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Button
                            variant="primary"
                            type="button"
                            onClick={handleLogin}
                            className="w-auto mx-auto d-block mb-3"
                        >
                            Login
                        </Button>

                        {/* Redireciona para a página do menu se autenticado */}
                        {autenticado && <Navigate to="/menu" />}

                        <Link to="/esqueci-minha-senha" className="d-block text-center">
                            Esqueci minha senha
                        </Link>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}