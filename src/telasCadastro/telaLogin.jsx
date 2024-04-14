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
    const [autenticado, setAutenticado] = useState(false);

    function handleLogin() {
        // Lógica de autenticação
        const autenticacaoSucesso = autenticarUsuario(username, password);
        if (autenticacaoSucesso) {
            setAutenticado(true);
        } else {
            // Tratamento para autenticação inválida
            alert('Usuário ou senha inválidos.');
        }
    }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Login</h2>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Nome de Usuário</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome de Usuário"
                id="nome"
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
                id="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <button onClick={handleLogin}>Login</button>
            {/* Redireciona para a página do menu se autenticado */}
            {autenticado && <Navigate to="/menu" />}
          </Form>
          <p>
            Não tem usuário? <Link to="/cadastro">Cadastre-se!</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}