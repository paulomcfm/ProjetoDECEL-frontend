import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function TelaCodigo() {
    const [codigo, setCodigo] = useState('');

    function handleVerificarCodigo() {
        // Verificar se o código inserido corresponde ao código enviado por e-mail
        // Redirecionar para a tela de alteração de senha se o código estiver correto
    }

    return (
        <Container>
            {/* Formulário de inserção de código */}
        </Container>
    );
}