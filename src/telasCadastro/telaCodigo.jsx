import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { redefinirSenha } from '../redux/usuarioReducer.js';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/TelaCodigo.css'; // Importar o arquivo CSS com estilos personalizados

export default function TelaCodigo() {
    const [codigo, setCodigo] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [msg, setMsg] = useState(false);
    const [erro, setErro] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/esqueci');
        return null; // or a loading indicator
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const resposta = await dispatch(redefinirSenha({ email, codigo, novaSenha }));
        if (!resposta.payload) {
            setErro(true);
            setMsg(false);
            setMensagem('Código de redefinição inválido. Por favor, verifique e tente novamente.');
        } else {
            setErro(false);
            setMsg(true);
            setMensagem(resposta.payload.mensagem);
        }
    };

    return (
        <Container className="custom-container">
            <div className="custom-form-wrapper">
                <h2 className="custom-heading">Redefinição de Senha</h2>
                <Form onSubmit={handleSubmit} className="custom-form">
                    <Form.Group controlId="formCodigo">
                        <Form.Label>Código de Redefinição</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Insira o código de redefinição"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            required
                            className="custom-input"
                        />
                    </Form.Group>
                    <Form.Group controlId="formNovaSenha">
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Insira a nova senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            required
                            className="custom-input"
                        />
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit" className="custom-button">
                        Redefinir Senha
                    </Button>
                </Form>
                {msg && <Alert variant="success" className="custom-alert">{mensagem}</Alert>}
                {erro && <Alert variant="danger" className="custom-alert">{mensagem}</Alert>}
                <Link to="/" className="custom-link">Voltar para o Login</Link>
            </div>
        </Container>
    );
}
