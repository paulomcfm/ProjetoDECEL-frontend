import { Container, Row } from "react-bootstrap";
import Pagina from "../templates/Pagina";
import TelaMensagem from "./TelaMensagem";
import FormCadManutencao from "./formularios/FormCadManutencao";
import { useState } from "react";
import TabelaManutencoes from "./tabelas/TabelaManutencoes";

export default function TelaCadastroManutencao(props) {
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [manutencaoParaEdicao, setManutencaoParaEdicao] = useState({
        placa: '',
        tipo: '',
        data: '',
        descricao: ''
    });
    const [modoEdicao, setModoEdicao] = useState(false);

    if (mostrarMensagem) {
        return (
            <TelaMensagem mensagem={mensagem} tipo={tipoMensagem} setMostrarMensagem={setMostrarMensagem} />
        );
    } else {
        return (
            <Pagina>
                <Container className="mt-4">
                    <Row className="justify-content-center">
                        {
                            exibirFormulario ?
                                <FormCadManutencao
                                    exibirFormulario={setExibirFormulario}
                                    manutencaoParaEdicao={manutencaoParaEdicao}
                                    setManutencaoParaEdicao={setManutencaoParaEdicao}
                                    modoEdicao={modoEdicao}
                                    setModoEdicao={setModoEdicao}
                                    setMostrarMensagem={setMostrarMensagem}
                                    setMensagem={setMensagem}
                                    setTipoMensagem={setTipoMensagem}
                                />
                                :
                                <TabelaManutencoes
                                    exibirFormulario={setExibirFormulario}
                                    setManutencaoParaEdicao={setManutencaoParaEdicao}
                                    setModoEdicao={setModoEdicao}
                                />
                        }
                    </Row>
                </Container>
            </Pagina>
        );
    }
}
