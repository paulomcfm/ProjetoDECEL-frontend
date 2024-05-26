import { Container, Row } from "react-bootstrap";
import TelaMensagem from "./TelaMensagem";
import Pagina from "../templates/Pagina";
import FormCadAluno from "./formularios/FormCadAluno";
import { useState } from "react";
import TabelaAlunos from "./tabelas/TabelaAlunos";

export default function TelaCadastroAluno(props) {
    const [exibirFormulario, setExibirFormulario] = useState(false);
    const [alunoParaEdicao, setAlunoParaEdicao] = useState({
        nome: '',
        rg: '',
        observacoes: '',
        dataNasc: '',
        celular: '',
        responsaveis: [],
        status: '',
        motivoInativo: ''
    });
    const [modoEdicao, setModoEdicao] = useState(false);

    return (
        <Pagina>
            <Container className="mt-4">
                <Row className="justify-content-center">
                    {
                        exibirFormulario ?
                            <FormCadAluno exibirFormulario={setExibirFormulario}
                                alunoParaEdicao={alunoParaEdicao}
                                setAlunoParaEdicao={setAlunoParaEdicao}
                                modoEdicao={modoEdicao}
                                setModoEdicao={setModoEdicao}
                            />
                            :
                            <TabelaAlunos exibirFormulario={setExibirFormulario}
                                alunoParaEdicao={alunoParaEdicao}
                                setAlunoParaEdicao={setAlunoParaEdicao}
                                modoEdicao={modoEdicao}
                                setModoEdicao={setModoEdicao}
                            />
                    }
                </Row>
            </Container>
        </Pagina>
    )

}