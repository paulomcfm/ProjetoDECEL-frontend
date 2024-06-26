import { Alert } from "react-bootstrap"
import Pagina from "../templates/Pagina"
import { useEffect } from "react"

export default function TelaMensagem(props) {
    useEffect(() => {
        setTimeout(() => {
            props.setMostrarMensagem(false);
        }, 2500);
    }, []);
    return (
        <Pagina>
            {
                <Alert variant={props.tipo} style={{ textAlign: 'center' }}>
                    <p>{props.mensagem}</p>
                </Alert>
            }
        </Pagina>
    )
}