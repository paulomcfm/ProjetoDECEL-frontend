import { Container, Row } from "react-bootstrap";
import TelaMensagem from "./TelaMensagem";
import Pagina from "../templates/Pagina";
import FormCadPontosEmbarque from "./formularios/FormCadPontosEmbarque";
import { useState } from "react";
import TabelaPontosEmbarque from "./tabelas/TabelaPontosEmbarque";

export default function TelaCadastroPontoEmbarque(props) {
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [pontoEmbarqueParaEdicao, setPontoEmbarqueParaEdicao] = useState({
        endereco: '',
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
                                <FormCadPontosEmbarque exibirFormulario={setExibirFormulario}
                                    pontoEmbarqueParaEdicao={pontoEmbarqueParaEdicao}
                                    setPontoEmbarqueParaEdicao={setPontoEmbarqueParaEdicao}
                                    modoEdicao={modoEdicao}
                                    setModoEdicao={setModoEdicao}
                                    setMostrarMensagem={setMostrarMensagem}
                                    setMensagem={setMensagem}
                                    setTipoMensagem={setTipoMensagem}
                                />
                                :
                                <TabelaPontosEmbarque exibirFormulario={setExibirFormulario}
                                    pontoEmbarqueParaEdicao={pontoEmbarqueParaEdicao}
                                    setPontoEmbarqueParaEdicao={setPontoEmbarqueParaEdicao}
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