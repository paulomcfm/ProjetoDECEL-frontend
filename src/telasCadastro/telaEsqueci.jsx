import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { solicitarCodigoRedefinicao } from '../redux/usuarioReducer.js';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
            setMensagem(resposta.payload.mensagem);
            setTimeout(()=>{
                if (resposta.payload) {
                    navigate('/codigo', { state: { email } });  // Pass email as state
                }
            }, 1500)
            
        } catch (error) {
            console.error('Erro ao solicitar código de redefinição:', error);
            // Trate o erro, se necessário
        }
    };

    return (
        <Container>
            <h2>Esqueci Minha Senha</h2>
            <br />
            <br />
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
                    {loading ? <Spinner /> : "Solicitar Código de Redefinição"}
                </Button>
            </Form>
            <br />
            {mensagem && <Alert variant="info">{mensagem}</Alert>}
        </Container>
    );
}
