import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function cadastrarUsuario(username, password) {
    // Lógica de cadastro aqui
    return true; // ou false, dependendo do sucesso do cadastro
}

export default function TelaCadastroUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [category, setCategory] = useState('educacao'); // Declarando category corretamente
    const [cadastrado, setCadastrado] = useState(false);

    function handleCadastro() {
        // Lógica de cadastro
        const cadastroSucesso = cadastrarUsuario(username, password);
        if (cadastroSucesso) {
            setCadastrado(true);
        } else {
            // Tratamento para cadastro inválido
            alert('Erro ao cadastrar usuário.');
        }
    }

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2>Cadastro</h2>
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

            <Form.Group controlId="formBasicCPF">
              <Form.Label>CPF</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="CPF"
                  id="cpf"
                  // Adicione o estado e o método de alteração do estado para o CPF
                  // value={cpf}
                  // onChange={(e) => setCPF(e.target.value)}
                  required
              />
            </Form.Group>

            <Form.Group controlId="formBasicCPF">
              <Form.Label>EMAIL</Form.Label>
              <Form.Control
                  type="email"
                  placeholder="email"
                  id="email"
                  // Adicione o estado e o método de alteração do estado para o email
                  // value={email}
                  // onChange={(e) => setemail(e.target.value)}
                  required
              />
            </Form.Group>

            <Form.Group controlId="formBasicCPF">
              <Form.Label>CELULAR</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="(xx) xxxxx-xxxx"
                  id="celular"
                  // Adicione o estado e o método de alteração do estado para o celular
                  // value={celular}
                  // onChange={(e) => setcelular(e.target.value)}
                  required
              />
            </Form.Group>
            
            <button onClick={handleCadastro}>Cadastrar</button>
            {/* Redireciona para a página do menu se autenticado */}
            {cadastrado && <Navigate to="/menu" />}
          </Form>
                </Col>
            </Row>
        </Container>
    );
}