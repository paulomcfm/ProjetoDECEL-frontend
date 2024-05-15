import { Container, Row } from "react-bootstrap";
import Pagina from "../templates/Pagina";
import FormCadInscricao from "./formularios/FormCadInscricao";
import TabelaInscricoes from "./tabelas/TabelaInscricoes";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function TelaCadastroInscricao(props) {
    const location = useLocation();
    const [alunoSelecionadoRelatorio, setAlunoSelecionadoRelatorio] = useState(location.state?.alunoSelecionadoRelatorio || null);
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [inscricaoParaEdicao, setInscricaoParaEdicao] = useState({
        codigo: '0',
        ano: '',
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

    return (
        <Pagina>
            <Container className="mt-4">
                <Row className="justify-content-center">
                    {
                        (alunoSelecionadoRelatorio || exibirFormulario) ?
                            <FormCadInscricao exibirFormulario={setExibirFormulario}
                                inscricaoParaEdicao={inscricaoParaEdicao}
                                setInscricaoParaEdicao={setInscricaoParaEdicao}
                                modoEdicao={modoEdicao}
                                setModoEdicao={setModoEdicao}
                                setAlunoSelecionadoRelatorio={setAlunoSelecionadoRelatorio}
                                alunoSelecionadoRelatorio={alunoSelecionadoRelatorio}
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