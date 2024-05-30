import { Container, Row } from "react-bootstrap";
import Pagina from "../templates/Pagina";
import TelaMensagem from "./TelaMensagem";
import FormCadVeiculo from "./formularios/FormCadVeiculo.jsx";
import { useState } from "react";
import TabelaVeiculo from "./tabelas/TabelaVeiculo.jsx";

export default function TelaCadastroVeiculo(props){
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [veiculoParaEdicao, setVeiculoParaEdicao] = useState({
        renavam: '',
        placa: '',
        modelo: '',
        capacidade: 0,
        tipo: ''
    });
    const [modoEdicao, setModoEdicao] = useState(false);

    if (mostrarMensagem) {
        return (
            <TelaMensagem mensagem={mensagem} tipo={tipoMensagem} setMostrarMensagem={setMostrarMensagem} />
        );
    }
    else{
        return (
            <Pagina>
                <Container className="mt-4">
                    <Row className="justify-content-center">
                        {
                            exibirFormulario ?
                                <FormCadVeiculo exibirFormulario={setExibirFormulario}
                                    veiculoParaEdicao={veiculoParaEdicao}
                                    setVeiculoParaEdicao={setVeiculoParaEdicao}
                                    modoEdicao={modoEdicao}
                                    setModoEdicao={setModoEdicao}
                                    setMostrarMensagem={setMostrarMensagem}
                                    setMensagem={setMensagem}
                                    setTipoMensagem={setTipoMensagem}
                                />
                                :
                                <TabelaVeiculo exibirFormulario={setExibirFormulario}
                                    veiculoParaEdicao={veiculoParaEdicao}
                                    setVeiculoParaEdicao={setVeiculoParaEdicao}
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