import { Container, Row } from "react-bootstrap";
import TelaMensagem from "./TelaMensagem";
import Pagina from "../templates/Pagina";
import FormCadResponsavel from "./formularios/FormCadResponsavel";
import { useState } from "react";
import TabelaResponsaveis from "./tabelas/TabelaResponsaveis";

export default function TelaCadastroResponsavel(props) {
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [responsavelParaEdicao, setResponsavelParaEdicao] = useState({
        nome: '',
        rg: '',
        cpf: '',
        email: '',
        telefone: '',
        celular: '',
        alunos: []
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
                                <FormCadResponsavel exibirFormulario={setExibirFormulario}
                                    responsavelParaEdicao={responsavelParaEdicao}
                                    setResponsavelParaEdicao={setResponsavelParaEdicao}
                                    modoEdicao={modoEdicao}
                                    setModoEdicao={setModoEdicao}
                                    setMostrarMensagem={setMostrarMensagem}
                                    setMensagem={setMensagem}
                                    setTipoMensagem={setTipoMensagem}
                                />
                                :
                                <TabelaResponsaveis exibirFormulario={setExibirFormulario}
                                    responsavelParaEdicao={responsavelParaEdicao}
                                    setResponsavelParaEdicao={setResponsavelParaEdicao}
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