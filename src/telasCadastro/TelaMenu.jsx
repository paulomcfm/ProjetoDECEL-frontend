import React from 'react';
import { Button, Col } from 'react-bootstrap';
import Pagina from '../templates/Pagina';
import '../templates/style.css'

export default function Menu(props) {
    return (
            <Pagina>
                {
                    <Col className="mt-4 text-center d-flex justify-content-center gap-2">
                        <Button variant="primary" className="custom-btn custom-btn-primary">Definir Rota</Button>
                        <Button variant="primary" className="custom-btn custom-btn-primary">Inscrever Aluno</Button>
                        <Button variant="primary" className="custom-btn custom-btn-primary">Alocar Aluno</Button>
                        <Button variant="primary" className="custom-btn custom-btn-primary">Registrar Manutenção</Button>
                    </Col>
                }
            </Pagina>
    )
}