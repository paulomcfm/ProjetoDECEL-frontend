import React from "react";
import { Modal, Button } from 'react-bootstrap';

export default function ModalExcluir(props) {
    return (
        <Modal show={props.mostrarModalExcluir} onHide={props.onCancelar}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.mensagemExcluir}</Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button variant="danger" onClick={props.onConfirmar}>Sim</Button>
                <Button variant="secondary" onClick={props.onCancelar}>Cancelar</Button>
            </Modal.Footer>
        </Modal>
    );
}
