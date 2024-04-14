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

                        <Form.Group controlId="formBasicCategory">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select as="select" value={category} onChange={handleCategoryChange} required>
                                <option value="educacao">Educação</option>
                                <option value="transporte">Transporte</option>
                            </Form.Select>
                            {category === 'educacao' && (
                                <Form.Text className="text-muted">
                                    Ao selecionar esta opção, seu usuário poderá cadastrar escolas, alunos e responsáveis, além de alocar alunos e inscrevê-los.
                                </Form.Text>
                            )}
                            {category === 'transporte' && (
                                <Form.Text className="text-muted">
                                    Ao selecionar esta opção, seu usuário poderá cadastrar veículos, rotas e motoristas, além de definir rotas e registrar manutenções.
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Button variant="primary" onClick={handleCadastro}>
                            Cadastrar
                        </Button>
                        {/* Redireciona para a página do menu se cadastrado */}
                        {cadastrado && <Navigate to="/menu" />}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}