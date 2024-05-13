import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { enviarEmail } from '../redux/usuarioReducer.js';

export default function Esqueci() {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    function obterProvedorDeEmail(enderecoEmail) {
        // Divide o endereço de e-mail usando "@" como separador
        const partes = enderecoEmail.split('@');
        // Retira a extensão que fica depois do ponto
        const provedorSemExtensao = partes[1].split('.')[0];
        // Retorna o provedor de e-mail sem a extensão
        return provedorSemExtensao;
    }

    function obterUsuarioDoEmail(enderecoEmail) {
        // Divide o endereço de e-mail usando "@" como separador
        const partes = enderecoEmail.split('@');
        // Retorna o primeiro elemento do array resultante, que é o usuário
        return partes[0];
    }

    async function handleEnviar() {
        const provedor = obterProvedorDeEmail(email);
        dispatch(enviarEmail({provedor, email}))
        .then((retorno) => {
            if (retorno.payload.status) {
                console.log(retorno);
                console.log(retorno.payload);
                console.log(retorno.payload.status);
                alert("Verifique o seu email!");
                {<Navigate to="/codigo" />}
            } else {
                alert('E-mail não cadastrado!');
            }
        })
        .catch((error) => {
            console.error('Erro ao enviar o e-mail:', error);
        });
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