import { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { adicionarResponsavel, atualizarResponsavel } from '../../redux/responsavelReducer';
import { useSelector, useDispatch } from 'react-redux';
import { adicionarParentesco } from '../../redux/parentescoReducer';
import { buscarAlunos } from '../../redux/alunoReducer';

export default function FormCadResponsavel(props) {
    const responsavelVazio = {
        nome: '',
        rg: '',
        cpf: '',
        email: '',
        telefone: '',
        celular: ''
    };

    const estadoInicialResponsavel = props.responsavelParaEdicao;
    const [responsavel, setResponsavel] = useState(estadoInicialResponsavel);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, responsaveis } = useSelector((state) => state.responsavel);
    const [termoBusca, setTermoBusca] = useState('');
    const { estadoAlu, mensagemAlu, alunos } = useSelector((state) => state.aluno);
    const [alunosSelecionados, setAlunosSelecionados] = useState([]);

    const dispatch = useDispatch();

    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setResponsavel({ ...responsavel, [componente.name]: componente.value });
    }

    function addAluno(aluno) {
        if (!alunosSelecionados.find(r => r.codigo === aluno.codigo)) {
            setAlunosSelecionados([...alunosSelecionados, aluno]);
        }
    }

    function removerAluno(index) {
        const novosAlunos = [...alunosSelecionados];
        novosAlunos.splice(index, 1);
        setAlunosSelecionados(novosAlunos);
    }

    useEffect(() => {
        if (termoBusca.trim() !== '') {
            dispatch(buscarAlunos());
        }
    }, [dispatch, termoBusca]);

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                dispatch(adicionarResponsavel(responsavel)).then((retorno) =>{
                    if(retorno.payload.status){
                        props.setMensagem('Responsável incluído com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        alunosSelecionados.forEach(aluno =>{
                            dispatch(adicionarParentesco({
                                codigoResponsavel: retorno.payload.responsavel.codigoGerado,
                                codigoAluno: aluno.codigo,
                                parentesco: aluno.parentesco
                            }));
                        });
                    }else{
                        props.setMensagem('Responsável não incluído!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            }
            else {
                dispatch(atualizarResponsavel(responsavel));
                props.setMensagem('Responsável alterado com sucesso');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
                props.setModoEdicao(false);
                props.setResponsavelParaEdicao(responsavelVazio);
            }
            setResponsavel(responsavelVazio);
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
            <h2 className="text-center">{props.modoEdicao ? 'Alterar Responsável' : 'Cadastrar Responsável'}</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao} id='formResponsavel'>
                <Form.Group className="mb-3">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome"
                        id="nome"
                        name="nome"
                        value={responsavel.nome}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>RG:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="RG"
                        id="rg"
                        name="rg"
                        value={responsavel.rg}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>CPF:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="CPF"
                        id="cpf"
                        name="cpf"
                        value={responsavel.cpf}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>E-mail:</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="E-mail"
                        id="email"
                        name="email"
                        value={responsavel.email}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Telefone:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Telefone"
                        id="telefone"
                        name="telefone"
                        value={responsavel.telefone}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Celular:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Celular"
                        id="celular"
                        name="celular"
                        value={responsavel.celular}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Alunos:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Buscar aluno"
                        id="aluno"
                        name="aluno"
                        value={termoBusca}
                        onChange={e => setTermoBusca(e.target.value)}
                    />
                    <Form.Group className="mb-3">
                        {termoBusca !== '' ? (
                            alunosFiltrados.map((aluno, index) => (
                                <Button
                                    key={index}
                                    variant="outline-primary"
                                    className="me-2 mb-2 mt-3"
                                    onClick={() => {
                                        setTermoBusca('');
                                        addAluno(aluno);
                                    }}
                                >
                                    {`${aluno.nome} - RG: ${aluno.rg}`}
                                </Button>
                            ))
                        ) : null}
                    </Form.Group>
                    <Form.Group>
                        {alunosSelecionados.map((aluno, index) => (
                            <div key={index} className="d-flex align-items-center">
                                <Button
                                    variant="primary"
                                    className="me-2 mb-2 mt-3"
                                    onClick={() => addAluno(aluno)}
                                >
                                    {`${aluno.nome} - RG: ${aluno.rg}`}
                                </Button>
                                <Form.Control
                                    type="text"
                                    placeholder="Parentesco"
                                    className="mb-2 mt-3"
                                    value={aluno.parentesco}
                                    onChange={(e) => {
                                        const novosAlunos = [...alunosSelecionados];
                                        novosAlunos[index] = {
                                            ...aluno,
                                            parentesco: e.target.value
                                        };
                                        setAlunosSelecionados(novosAlunos);
                                    }}
                                />
                                <Button
                                    variant="danger"
                                    className="mb-2 mt-3"
                                    onClick={() => removerAluno(index)}
                                >
                                    Remover
                                </Button>
                            </div>
                        ))}
                    </Form.Group>

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