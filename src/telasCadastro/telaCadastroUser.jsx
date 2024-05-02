import { Container, Row } from "react-bootstrap";
import TelaMensagem from "./TelaMensagem";
import Pagina from "../templates/Pagina";
import FormCadUsuario from "./formularios/FormCadUsuario";
import { useState } from "react";
import TabelaUsuarios from "./tabelas/tabelaUsuarios";

export default function TelaCadastroUser(props) {
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [usuarioParaEdicao, setUsuarioParaEdicao] = useState({
        nome: '',
        senha:'',
        cpf: '',
        email:'',
        celular: ''
    });
    const [modoEdicao, setModoEdicao] = useState(false);

    if (mostrarMensagem) {
        return (
            <TelaMensagem mensagem={mensagem} tipo={tipoMensagem} setMostrarMensagem={setMostrarMensagem} />
        );
    }
    else {
        return (
            <Pagina>
                <Container className="mt-4">
                    <Row className="justify-content-center">
                        {
                            exibirFormulario ?
                                <FormCadUsuario exibirFormulario={setExibirFormulario}
                                    usuarioParaEdicao={usuarioParaEdicao}
                                    setUsuarioParaEdicao={setUsuarioParaEdicao}
                                    modoEdicao={modoEdicao}
                                    setModoEdicao={setModoEdicao}
                                    setMostrarMensagem={setMostrarMensagem}
                                    setMensagem={setMensagem}
                                    setTipoMensagem={setTipoMensagem}
                                />
                                :
                                <TabelaUsuarios exibirFormulario={setExibirFormulario}
                                    usuarioParaEdicao={usuarioParaEdicao}
                                    setUsuarioParaEdicao={setUsuarioParaEdicao}
                                    modoEdicao={modoEdicao}
                                    setModoEdicao={setModoEdicao}
                                />
                        }
                    </Row>
                </Container>
            </Pagina>
        )
    }
}
