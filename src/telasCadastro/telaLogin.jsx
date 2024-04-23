import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { autenticarUsuario } from '../redux/usuarioReducer'; // Importa a função de autenticação

export default function TelaLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [autenticado, setAutenticado] = useState(false);
    const dispatch = useDispatch(); // Obtém a função dispatch do Redux

    async function handleLogin() {
        // Despacha a action para autenticar o usuário
        dispatch(autenticarUsuario({ nome: username, cpf }))
            .then((retorno) => {
                console.log(retorno);
                console.log(retorno.payload);
                console.log(retorno.payload.status);
                if (retorno.payload.status) {
                    setAutenticado(true); // Define autenticado como true se a autenticação for bem-sucedida
                } else {
                    console.log(retorno);
                    // Tratamento para autenticação inválida
                    alert('Usuário ou CPF inválidos.');
                }
            })
            .catch((error) => {
                console.error('Erro ao autenticar usuário:', error);
                // Tratamento para erros de autenticação
                alert('Erro ao autenticar usuário. Por favor, tente novamente mais tarde.');
            });
    }

    function formatarCPF(cpf) {
        if (!cpf) return cpf;
        // Remove todos os caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');

        // Aplica a máscara para CPF (xxx.xxx.xxx-xx)
        cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

        return cpf;
    }

    function handleCpfChange(event) {
        const cpfDigitado = event.target.value;
        const cpfFormatado = formatarCPF(cpfDigitado);
        setCpf(cpfFormatado);
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
                                onChange={handleCpfChange} // Utiliza a função handleCpfChange para formatar o CPF
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