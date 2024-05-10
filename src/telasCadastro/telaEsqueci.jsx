import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { enviarCodigoPorEmail } from '../validacoes/servicoDeEmail.js';

export default function Esqueci() {
    const [email, setEmail] = useState('');

    function gerarCodigo() {
        const codigo = Math.floor(10000 + Math.random() * 90000);
        return codigo.toString();
    }
    
    function obterProvedorDeEmail(email) {
        // Divide o endereço de e-mail usando "@" como separador
        const partes = email.split('@');
        // Retorna o segundo elemento do array resultante
        return partes[1];
    }

    async function handleEnviar() {
        const codigo = gerarCodigo();
        const provedor = obterProvedorDeEmail(email);
        const enviado = await enviarCodigoPorEmail(email, codigo, provedor);
        // Lógica para enviar o e-mail e solicitar a redefinição da senha
        console.log('E-mail enviado para: ', email);
        // Navegar de volta para a tela de login
        // Pode usar o componente Navigate ou window.location.href = '/login'
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center">Esqueci Minha Senha</h2>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                pattern="\S+@\S+\.\S+"
                            />
                        </Form.Group>
                        <br />
                        <div className="text-center">
                            <Button variant="primary" onClick={handleEnviar} className="mb-3">
                                Enviar
                            </Button>
                        </div>
                        <div className="text-center">
                            <Link to="/">Voltar para o login</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}