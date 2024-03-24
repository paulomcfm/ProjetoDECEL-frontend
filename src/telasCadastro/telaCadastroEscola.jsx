import { Container, Row } from "react-bootstrap";
import TelaMensagem from "./TelaMensagem";
import Pagina from "../templates/Pagina";
import FormCadEscola from "./formularios/FormCadEscola";
import { useState } from "react";
import TabelaEscolas from "./tabelas/TabelaEscolas";

export default function TelaCadastroEscola(props) {
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [escolaParaEdicao, setEscolaParaEdicao] = useState({
        nome: '',
        endereco: '',
        tipo: '',
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
                                <FormCadEscola exibirFormulario={setExibirFormulario}
                                    escolaParaEdicao={escolaParaEdicao}
                                    setEscolaParaEdicao={setEscolaParaEdicao}
                                    modoEdicao={modoEdicao}
                                    setModoEdicao={setModoEdicao}
                                    setMostrarMensagem={setMostrarMensagem}
                                    setMensagem={setMensagem}
                                    setTipoMensagem={setTipoMensagem}
                                />
                                :
                                <TabelaEscolas exibirFormulario={setExibirFormulario}
                                    escolaParaEdicao={escolaParaEdicao}
                                    setEscolaParaEdicao={setEscolaParaEdicao}
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