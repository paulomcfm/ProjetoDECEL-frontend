import { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { adicionarAluno, atualizarAluno } from '../../redux/alunoReducer';
import { useSelector, useDispatch } from 'react-redux';
import { buscarResponsaveis } from '../../redux/responsavelReducer';
import { useEffect } from 'react';


export default function FormCadAlunos(props) {

    const alunoVazio = {
        nome: '',
        rg: '',
        observacoes: '',
        dataNasc: ''
    }

    const estadoInicialAluno = props.alunoParaEdicao;
    const [aluno, setAluno] = useState(estadoInicialAluno);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, alunos } = useSelector((state) => state.aluno);
    const [termoBusca, setTermoBusca] = useState('');
    const { estadoResp, mensagemResp, responsaveis } = useSelector((state) => state.responsavel);
    const [responsaveisSelecionados, setResponsaveisSelecionados] = useState([]);
    const [responsavelHover, setResponsavelHover] = useState(-1);

    const dispatch = useDispatch();

    const responsaveisFiltrados = responsaveis.filter(responsavel =>
        responsavel.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setAluno({ ...aluno, [componente.name]: componente.value });
    }

    function adicionarResponsavel(responsavel) {
        if (!responsaveisSelecionados.find(r => r.codigo === responsavel.codigo)) {
            setResponsaveisSelecionados([...responsaveisSelecionados, responsavel]);
        }
    }

    function removerResponsavel(index) {
        const novosResponsaveis = [...responsaveisSelecionados];
        novosResponsaveis.splice(index, 1);
        setResponsaveisSelecionados(novosResponsaveis);
    }

    useEffect(() => {
        if (termoBusca.trim() !== '') {
            dispatch(buscarResponsaveis());
        }
    }, [dispatch, termoBusca]);

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            const alunoComResponsaveis = { ...aluno, responsaveis: responsaveisSelecionados };
            if (!props.modoEdicao) {
                dispatch(adicionarAluno(alunoComResponsaveis));
                props.setMensagem('Aluno incluído com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
            }
            else {
                dispatch(atualizarAluno(alunoComResponsaveis));
                props.setMensagem('Aluno alterado com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
                props.setModoEdicao(false);
                props.setAlunoParaEdicao(alunoVazio);
            }
            setAluno(alunoVazio);
            setFormValidado(false);
        }
        else {
            setFormValidado(true);
        }

        e.stopPropagation();
        e.preventDefault();
    }


    return (
        <>
            <h2 className="text-center">Cadastrar Aluno</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao} id='formAluno'>
                <Form.Group className="mb-3">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome"
                        id="nome"
                        name="nome"
                        value={aluno.nome}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>RG:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="RG"
                        id="rg"
                        name="rg"
                        value={aluno.rg}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Data de Nascimento:</Form.Label>
                    <Form.Control
                        type="date"
                        id="dataNasc"
                        name="dataNasc"
                        value={aluno.dataNasc}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Responsável:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Busque um responsável"
                        id="responsavel"
                        name="responsavel"
                        value={termoBusca}
                        onChange={e => setTermoBusca(e.target.value)}
                    />
                    <Form.Group className="mb-3">
                        {termoBusca !== '' ? (
                            responsaveisFiltrados.map((responsavel, index) => (
                                <Button
                                    key={index}
                                    variant="outline-primary"
                                    className="me-2 mb-2 mt-3"
                                    onClick={() => {
                                        setTermoBusca('');
                                        adicionarResponsavel(responsavel);
                                    }}
                                >
                                    {`${responsavel.nome} - RG: ${responsavel.rg}`}
                                </Button>
                            ))
                        ) : null}
                    </Form.Group>
                    <Form.Group>
                        {responsaveisSelecionados.map((responsavel, index) => (
                            <div key={index} className="d-flex align-items-center">
                                <Button
                                    variant="primary"
                                    className="me-2 mb-2 mt-3"
                                    onClick={() => adicionarResponsavel(responsavel)}
                                >
                                    {`${responsavel.nome} - RG: ${responsavel.rg}`}
                                </Button>
                                <Form.Control
                                    type="text"
                                    placeholder="Parentesco"
                                    className="mb-2 mt-3"
                                    value={responsavel.parentesco}
                                    onChange={(e) => {
                                        const novosResponsaveis = [...responsaveisSelecionados];
                                        novosResponsaveis[index].parentesco = e.target.value;
                                        setResponsaveisSelecionados(novosResponsaveis);
                                    }}
                                />
                                <Button
                                    variant="danger"
                                    className="mb-2 mt-3"
                                    onClick={() => removerResponsavel(index)}
                                >
                                    Remover
                                </Button>
                            </div>
                        ))}
                    </Form.Group>

                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Observações:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Observações"
                        id="observacoes"
                        name="observacoes"
                        value={aluno.observacoes}
                        onChange={manipularMudancas}
                    />
                </Form.Group>
                <Row>
                    <Col md={6} offset={5} className="d-flex justify-content-end">
                        <Button type="submit" variant={"primary"} onClick={() => {
                        }}>{props.modoEdicao ? "Alterar" : "Cadastrar"}</Button>
                    </Col>
                    <Col>
                        <Button type="submit" variant={"danger"} onClick={() => {
                            props.exibirFormulario(false);
                        }}>Voltar</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
