import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function Esqueci() {
    const [email, setEmail] = useState('');

    function handleEnviar() {
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