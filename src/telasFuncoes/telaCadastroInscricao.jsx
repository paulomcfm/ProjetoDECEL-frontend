import { Container, Row } from "react-bootstrap";
import TelaMensagem from "../telasCadastro/TelaMensagem";
import Pagina from "../templates/Pagina";
import FormCadInscricao from "./formularios/FormCadInscricao";
import TabelaInscricoes from "./tabelas/TabelaInscricoes";
import { useState } from "react";

export default function TelaCadastroInscricao(props) {
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [inscricaoParaEdicao, setInscricaoParaEdicao] = useState({
        codigo: '0',
        rua: '',
        numero: '',
        bairro: '',
        cep: '',
        ensino: '',
        periodo: '',
        turma: '',
        anoLetivo: '',
        aluno: {
            codigo: 0,
            nome: '',
            rg: '',
            observacoes: '',
            dataNasc: '',
            responsaveis: []
        },
        pontoEmbarque: {
            codigo: 0,
            rua: '',
            numero: '',
            bairro: '',
            cep: ''
        },
        escola: {
            codigo: 0,
            nome: '',
            tipo: '',
            rua: '',
            numero: '',
            bairro: '',
            cep: '',
            email: '',
            telefone: ''
        }
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
                                <FormCadInscricao exibirFormulario={setExibirFormulario}
                                    inscricaoParaEdicao={inscricaoParaEdicao}
                                    setInscricaoParaEdicao={setInscricaoParaEdicao}
                                    modoEdicao={modoEdicao}
                                    setModoEdicao={setModoEdicao}
                                    setMostrarMensagem={setMostrarMensagem}
                                    setMensagem={setMensagem}
                                    setTipoMensagem={setTipoMensagem}
                                />
                                :
                                <TabelaInscricoes exibirFormulario={setExibirFormulario}
                                    inscricaoParaEdicao={inscricaoParaEdicao}
                                    setInscricaoParaEdicao={setInscricaoParaEdicao}
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