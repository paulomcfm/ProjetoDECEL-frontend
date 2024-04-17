import { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { adicionarAluno, atualizarAluno } from '../../redux/alunoReducer';
import { useSelector, useDispatch } from 'react-redux';
import { buscarResponsaveis } from '../../redux/responsavelReducer';
import { adicionarParentesco, atualizarParentesco, removerParentesco } from '../../redux/parentescoReducer';
import { useEffect } from 'react';


export default function FormCadAlunos(props) {

    const alunoVazio = {
        nome: '',
        rg: '',
        observacoes: '',
        dataNasc: '',
        celular: '',
        responsaveis: []
    }

    const estadoInicialAluno = props.alunoParaEdicao;
    const [aluno, setAluno] = useState(estadoInicialAluno);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, alunos } = useSelector((state) => state.aluno);
    const [termoBusca, setTermoBusca] = useState('');
    const { estadoResp, mensagemResp, responsaveis } = useSelector((state) => state.responsavel);
    const [responsaveisSelecionados, setResponsaveisSelecionados] = useState([]);
    const [responsaveisAntes, setResponsaveisAntes] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (termoBusca.trim() !== '') {
            dispatch(buscarResponsaveis());
        }
    }, [dispatch, termoBusca]);

    useEffect(() => {
        dispatch(buscarResponsaveis());
    }, []);

    useEffect(() => {
        if (props.alunoParaEdicao.responsaveis.length > 0) {
            const responsaveisSelecionados = props.alunoParaEdicao.responsaveis.map(responsavel => {
                const responsavelCompleto = responsaveis.find(r => r.codigo === responsavel.codigoResponsavel);
                if (responsavelCompleto) {
                    return {
                        ...responsavelCompleto,
                        parentesco: responsavel.parentesco
                    };
                }
                return null;
            }).filter(responsavel => responsavel !== null);

            setResponsaveisSelecionados(responsaveisSelecionados);
            setResponsaveisAntes(responsaveisSelecionados);
        }

    }, [responsaveis]);

    const responsaveisFiltrados = responsaveis.filter(responsavel =>
        responsavel.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    function formatDate(s) {
        var b = s.split(/\D/);
        return `${b[0]}-${(b[1].length === 1 ? '0' : '') + b[1]}-${(b[2].length === 1 ? '0' : '') + b[2]}`;
    }

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setAluno({ ...aluno, [componente.name]: componente.value });
    }


    function addResponsavel(responsavel) {
        if (!responsaveisSelecionados.find(r => r.codigo === responsavel.codigo)) {
            setResponsaveisSelecionados([...responsaveisSelecionados, responsavel]);
        }
    }

    function removerResponsavel(index) {
        const novosResponsaveis = [...responsaveisSelecionados];
        novosResponsaveis.splice(index, 1);
        setResponsaveisSelecionados(novosResponsaveis);
    }


    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                dispatch(adicionarAluno(aluno)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Aluno incluído com sucesso!');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        responsaveisSelecionados.forEach(responsavel => {
                            dispatch(adicionarParentesco({
                                codigoAluno: retorno.payload.aluno.codigoGerado,
                                codigoResponsavel: responsavel.codigo,
                                parentesco: responsavel.parentesco
                            }));
                        });
                    } else {
                        props.setMensagem('Aluno não incluído!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            }
            else {
                dispatch(atualizarAluno(aluno)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Aluno alterado com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        props.setModoEdicao(false);
                        props.setAlunoParaEdicao(alunoVazio);
                        responsaveisSelecionados.forEach(responsavel => {
                            if (!responsaveisAntes.find(r => r.codigo === responsavel.codigo)) {
                                dispatch(adicionarParentesco({
                                    codigoAluno: retorno.payload.aluno.codigoGerado,
                                    codigoResponsavel: responsavel.codigo,
                                    parentesco: responsavel.parentesco
                                }));
                            }
                        });

                        responsaveisSelecionados.forEach(responsavel => {
                            if (responsaveisAntes.find(r => r.codigo === responsavel.codigo)) {
                                dispatch(atualizarParentesco({
                                    codigoAluno: retorno.payload.aluno.codigoGerado,
                                    codigoResponsavel: responsavel.codigo,
                                    parentesco: responsavel.parentesco
                                }));
                            }
                        });

                        responsaveisAntes.forEach(responsavel => {
                            if (!responsaveisSelecionados.find(r => r.codigo === responsavel.codigo)) {
                                dispatch(removerParentesco({
                                    codigoAluno: retorno.payload.aluno.codigoGerado,
                                    codigoResponsavel: responsavel.codigo,
                                    parentesco: responsavel.parentesco
                                }));
                            }
                        });
                    } else {
                        props.setMensagem('Aluno não alterado!');
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
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
                    <Form.Label>Nome completo(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome completo"
                        id="nome"
                        name="nome"
                        value={aluno.nome}
                        onChange={manipularMudancas}
                        required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>RG(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="XX.XXX.XXX-X"
                        id="rg"
                        name="rg"
                        value={aluno.rg}
                        onChange={manipularMudancas}
                        required
                    />
                </Form.Group>

                <Row>
                    <Col md={2}>
                        <Form.Group className="mb-3">
                            <Form.Label>Data de Nascimento(*):</Form.Label>
                            <Form.Control
                                type="date"
                                id="dataNasc"
                                name="dataNasc"
                                value={aluno.dataNasc ? formatDate(aluno.dataNasc) : ''}
                                onChange={manipularMudancas}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
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
                                        addResponsavel(responsavel);
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
                                    variant="secondary"
                                    className="me-2 mb-2 mt-3 w-75"
                                    onClick={() => addResponsavel(responsavel)}
                                >
                                    {`${responsavel.nome} - RG: ${responsavel.rg}`}
                                </Button>
                                <Form.Select
                                    className="mb-2 mt-3"
                                    value={responsavel.parentesco}
                                    onChange={(e) => {
                                        const novosResponsaveis = [...responsaveisSelecionados];
                                        novosResponsaveis[index] = {
                                            ...responsavel,
                                            parentesco: e.target.value
                                        };
                                        setResponsaveisSelecionados(novosResponsaveis);
                                    }}
                                    required
                                >
                                    <option value="">Selecione o parentesco</option>
                                    <option value="Pai">Pai</option>
                                    <option value="Mãe">Mãe</option>
                                    <option value="Avô">Avô</option>
                                    <option value="Avó">Avó</option>
                                    <option value="Tio">Tio</option>
                                    <option value="Tia">Tia</option>
                                    <option value="Padrasto">Padrasto</option>
                                    <option value="Madrasta">Madrasta</option>
                                </Form.Select>
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

                    <Form.Group className="mb-3">
                        <Form.Label>Celular:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Número de celular"
                            id="celular"
                            name="celular"
                            value={aluno.celular}
                            onChange={manipularMudancas}
                        />
                    </Form.Group>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Observações:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Observações do aluno"
                        id="observacoes"
                        name="observacoes"
                        value={aluno.observacoes}
                        onChange={manipularMudancas}
                    />
                </Form.Group>
                <p>(*) Campos obrigatórios</p>
                <Row>
                    <Col md={6} offset={5} className="d-flex justify-content-end">
                        <Button type="submit" variant={"primary"} onClick={() => {
                        }}>{props.modoEdicao ? "Alterar" : "Cadastrar"}</Button>
                    </Col>
                    <Col>
                        <Button type="submit" variant={"danger"} onClick={() => {
                            props.exibirFormulario(false);
                            props.setModoEdicao(false);
                        }}>Voltar</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
