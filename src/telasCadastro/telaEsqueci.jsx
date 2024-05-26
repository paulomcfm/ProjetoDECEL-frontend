import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { solicitarCodigoRedefinicao } from '../redux/usuarioReducer.js';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/TelaEsqueci.css';

export default function TelaEsqueci() {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const resposta = await dispatch(solicitarCodigoRedefinicao(email));
            setLoading(false);
            setMensagem("Código enviado para seu E-mail!");
            setTimeout(() => {
                if (resposta.payload) {
                    navigate('/codigo', { state: { email } });  // Pass email as state
                }
            }, 1500);

        } catch (error) {
            console.error('Erro ao solicitar código de redefinição:', error);
            setMensagem("Erro ao enviar código");
        }
    };

    return (
        <Container>
            <br />
            <h2>Esqueci Minha Senha</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="xxxx@xxxx.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    {loading ? <Spinner animation="border" size="sm" /> : "Solicitar Código de Redefinição"}
                </Button>
            </Form>

            {mensagem && <Alert variant="info">{mensagem}</Alert>}
        </Container>
    );
}