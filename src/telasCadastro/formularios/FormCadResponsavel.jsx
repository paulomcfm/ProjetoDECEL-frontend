import { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { adicionarResponsavel, atualizarResponsavel } from '../../redux/responsavelReducer';
import { useSelector, useDispatch } from 'react-redux';
import { adicionarParentesco, atualizarParentesco, removerParentesco } from '../../redux/parentescoReducer';
import { buscarAlunos } from '../../redux/alunoReducer';
import InputMask from 'react-input-mask';
import validarCelular from '../../validacoes/validarCelular';
import validarTelefone from '../../validacoes/validarTelefone';
import validarCPF from '../../validacoes/validarCpf';
import validarRG from '../../validacoes/validarRG';

export default function FormCadResponsavel(props) {
    const responsavelVazio = {
        nome: '',
        rg: '',
        cpf: '',
        email: '',
        telefone: '',
        celular: '',
        alunos: []
    };

    const estadoInicialResponsavel = props.responsavelParaEdicao;
    const [responsavel, setResponsavel] = useState(estadoInicialResponsavel);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, responsaveis } = useSelector((state) => state.responsavel);
    const [termoBusca, setTermoBusca] = useState('');
    const { estadoAlu, mensagemAlu, alunos } = useSelector((state) => state.aluno);
    const [alunosSelecionados, setAlunosSelecionados] = useState([]);
    const [alunosAntes, setAlunosAntes] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (termoBusca.trim() !== '') {
            dispatch(buscarAlunos());
        }
    }, [dispatch, termoBusca]);

    useEffect(() =>{
        dispatch(buscarAlunos());
    }, []);

    useEffect(()=>{
        if(props.responsavelParaEdicao.alunos.length > 0){
            const alunosSelecionados = props.responsavelParaEdicao.alunos.map(aluno =>{
                const alunoCompleto = alunos.find(a => a.codigo === aluno.codigoAluno);
                if(alunoCompleto){
                    return{
                        ...alunoCompleto,
                        parentesco: aluno.parentesco
                    };
                }
                return null;
            }).filter(aluno => aluno !== null);

            setAlunosSelecionados(alunosSelecionados);
            setAlunosAntes(alunosSelecionados);
        }
    }, [alunos])

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

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        let telefoneValido = true;
        // Verifica se o campo de telefone não está vazio antes de validar
        if (responsavel.telefone.trim() !== ''){
            telefoneValido = validarTelefone(responsavel.telefone); // Verifica se o telefone é válido
        }
        console.log(validarCelular(responsavel.celular), validarRG(responsavel.rg), validarCPF(responsavel.cpf), telefoneValido)
        if (form.checkValidity() && validarCelular(responsavel.celular) && validarRG(responsavel.rg) && validarCPF(responsavel.cpf)
        && telefoneValido)
        {
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
            else
            {
                    dispatch(atualizarResponsavel(responsavel)).then((retorno) => {
                        if(retorno.payload.status){
                            props.setMensagem('Responsável alterado com sucesso');
                            props.setTipoMensagem('success');
                            props.setMostrarMensagem(true);
                            props.setModoEdicao(false);
                            props.setResponsavelParaEdicao(responsavelVazio);
                            alunosSelecionados.forEach(aluno => {
                                if(!alunosAntes.find(a => a.codigo === aluno.codigo)){
                                    dispatch(adicionarParentesco({
                                        codigoResponsavel: retorno.payload.responsavel.codigoGerado,
                                        codigoAluno: aluno.codigo,
                                        parentesco: aluno.parentesco
                                    }));
                                }
                            });

                            alunosSelecionados.forEach(aluno => {
                                if(!alunosAntes.find(a => a.codigo === aluno.codigo)){
                                    dispatch(atualizarParentesco({
                                        codigoResponsavel: retorno.payload.responsavel.codigoGerado,
                                        codigoAluno: aluno.codigo,
                                        parentesco: aluno.parentesco
                                    }));
                                }
                            });

                            alunosAntes.forEach(aluno => {
                                if(!alunosSelecionados.find(a => a.codigo === aluno.codigo)){
                                    dispatch(removerParentesco({
                                        codigoResponsavel: retorno.payload.responsavel.codigoGerado,
                                        codigoAluno: aluno.codigo,
                                        parentesco: aluno.parentesco
                                    }));
                                }
                            });
                        }
                        else{
                            props.setMensagem('Responsável não alterado!');
                            props.setTipoMensagem('danger');
                            props.setMostrarMensagem(true);
                        }
                    });
            }
            setResponsavel(responsavelVazio);
            setFormValidado(false);
        }
        else {
            alert("Por favor, cheque os campos inseridos.");
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
                    <Form.Label>Nome completo(*):</Form.Label>
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
                    <Form.Label>RG(*):</Form.Label>
                    <InputMask
                        mask="99.999.999-9" // Máscara para o RG
                        maskChar="_"
                        placeholder="XX.XXX.XXX-X"
                        id="rg"
                        name="rg"
                        value={responsavel.rg}
                        onChange={manipularMudancas}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        RG inválido.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>CPF(*):</Form.Label>
                    <InputMask
                        mask="999.999.999-99" // Máscara para o CPF
                        maskChar="_"
                        placeholder="XXX.XXX.XXX-XX"
                        id="cpf"
                        name="cpf"
                        value={responsavel.cpf}
                        onChange={manipularMudancas}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        CPF inválido.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>E-mail(*):</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="abc123@email.com"
                        id="email"
                        name="email"
                        value={responsavel.email}
                        onChange={manipularMudancas}
                        required
                        pattern="\S+@\S+\.\S+"
                    />
                    <Form.Control.Feedback type="invalid">
                        E-mail inválido.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Telefone:</Form.Label>
                    <InputMask
                        mask="(99) 9999-9999" // Máscara para o telefone
                        maskChar="_"
                        placeholder="(99) 9999-9999"
                        id="telefone"
                        name="telefone"
                        value={responsavel.telefone}
                        onChange={manipularMudancas}
                    />
                    <Form.Control.Feedback type="invalid">
                        Telefone inválido.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Celular(*):</Form.Label>
                    <InputMask
                        mask="(99) 99999-9999" // Máscara para o telefone
                        maskChar="_"
                        placeholder="(99) 99999-9999"
                        id="celular"
                        name="celular"
                        value={responsavel.celular}
                        onChange={manipularMudancas}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Celular inválido.
                    </Form.Control.Feedback>
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
                                    placeholder="Parentesco do aluno"
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
                                    required
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
                <p>(*) Campos obrigatórios</p>
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