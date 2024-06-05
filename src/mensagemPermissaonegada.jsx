import React from 'react';
import { Alert } from 'react-bootstrap';
import Pagina from "./templates/Pagina.jsx"

const MensagemPermissaoNegada = () => {
    return (
        <Pagina>
            <Alert variant="danger" style={{ textAlign: 'center' }}>
                <p>Você não tem permissão de acesso a esta parte do sistema.</p>
            </Alert>
        </Pagina>
    );
};

export default MensagemPermissaoNegada;