import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { solicitarCodigoRedefinicao } from '../redux/usuarioReducer.js';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function TelaEsqueci() {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const resposta = dispatch(solicitarCodigoRedefinicao(email));
        setMensagem(resposta.payload.mensagem);
        if (resposta.payload.ok) {
            navigate('/codigo', { state: { email } });  // Pass email as state
        }
    };

    return (
        <Container>
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
                <Button variant="primary" type="submit">
                    Solicitar Código de Redefinição
                </Button>
            </Form>
            {mensagem && <Alert variant="info">{mensagem}</Alert>}
        </Container>
    );
}
