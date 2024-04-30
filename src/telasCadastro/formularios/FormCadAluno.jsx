import { useState } from 'react';
import { Form, Button, Col, Row, OverlayTrigger, Popover } from 'react-bootstrap';
import { adicionarAluno, atualizarAluno } from '../../redux/alunoReducer';
import { useSelector, useDispatch } from 'react-redux';
import { buscarResponsaveis } from '../../redux/responsavelReducer';
import { useEffect } from 'react';
import validarCelular from '../../validacoes/validarCelular';
import InputMask from 'react-input-mask';

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

    function formatDate(s) {
        var b = s.split(/\D/);
        return `${b[0]}-${(b[1].length === 1 ? '0' : '') + b[1]}-${(b[2].length === 1 ? '0' : '') + b[2]}`;
    }

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        let valor = componente.value;

        if (componente.name === 'celular') {
            valor = formatarCelular(valor);
        }
        setAluno({ ...aluno, [componente.name]: componente.value });
    }

    const formatarCelular = (celular) => {
        if (!celular) return celular;

        let celularFormatado = celular.replace(/\D/g, '');

        celularFormatado = celularFormatado.substring(0, 11);
        if (celularFormatado.length === 8) {
            celularFormatado = `${celularFormatado.substring(0, 4)}-${celularFormatado.substring(4)}`;
        }
        if (celularFormatado.length > 2) {
            celularFormatado = `(${celularFormatado.substring(0, 2)}) ${celularFormatado.substring(2)}`;
        }
        if (celularFormatado.length > 9) {
            celularFormatado = `${celularFormatado.substring(0, 9)}-${celularFormatado.substring(9)}`;
        }

        return celularFormatado;
    }

    function limparString(texto) {
        return texto.replace(/[^A-Za-z0-9-]/g, '');
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        var celularValidado = false;
        if (aluno.celular == '')
            celularValidado = true;
        else {
            celularValidado = validarCelular(aluno.celular);
        }
        aluno.rg = limparString(aluno.rg);
        if (form.checkValidity() && celularValidado) {
            if (!props.modoEdicao) {
                aluno.responsaveis = responsaveisSelecionados;
                dispatch(adicionarAluno(aluno)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Aluno incluído com sucesso!');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                    } else {
                        props.setMensagem('Aluno não incluído! ' + retorno.payload.mensagem);
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            }
            else {
                aluno.responsaveis = responsaveisSelecionados;
                dispatch(atualizarAluno(aluno)).then((retorno) => {
                    if (retorno.payload.status) {
                        props.setMensagem('Aluno alterado com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        props.setModoEdicao(false);
                        props.setAlunoParaEdicao(alunoVazio);
                    } else {
                        props.setMensagem('Aluno não alterado! ' + retorno.payload.mensagem);
                        props.setTipoMensagem('danger');
                        props.setMostrarMensagem(true);
                    }
                });
            }
            setAluno(alunoVazio);
            setFormValidado(false);
            props.exibirFormulario(false);
        }
        else {
            setFormValidado(true);
        }

        e.stopPropagation();
        e.preventDefault();
    }

    useEffect(() => {
        if (termoBusca.trim() === '') {
            dispatch(buscarResponsaveis());
        }
    }, [dispatch, termoBusca]);

    useEffect(() => {
        dispatch(buscarResponsaveis());
    }, []);

    useEffect(() => {
        if (props.alunoParaEdicao.responsaveis.length > 0 && responsaveisSelecionados.length === 0) {
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

    function removerResponsavel(index) {
        const novosResponsaveis = [...responsaveisSelecionados];
        novosResponsaveis.splice(index, 1);
        setResponsaveisSelecionados(novosResponsaveis);
    }

    function addResponsavel(responsavel) {
        if (!responsaveisSelecionados.find(r => r.codigo === responsavel.codigo)) {
            setResponsaveisSelecionados([...responsaveisSelecionados, responsavel]);
        }
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
                        maxLength={255}
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
                        maxLength={20}
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
                                <OverlayTrigger
                                    trigger="hover"
                                    key="bottom"
                                    placement="bottom"
                                    overlay={
                                        <Popover id="popover-positioned-bottom">
                                            <Popover.Header as="h3">{responsavel.nome}</Popover.Header>
                                            <Popover.Body>
                                                <p>RG: {responsavel.rg}</p>
                                                <p>CPF: {responsavel.cpf}</p>
                                                <p>E-mail: {responsavel.email}</p>
                                                <p>Celular: {responsavel.celular}</p>
                                                <p>Telefone: {responsavel.telefone}</p>
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <Button
                                        variant="secondary"
                                        className="me-2 mb-2 mt-3 w-75"
                                        onClick={() => addResponsavel(responsavel)}
                                    >
                                        {`${responsavel.nome} - RG: ${responsavel.rg}`}
                                    </Button>
                                </OverlayTrigger>
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
                        <InputMask
                            style={{ width: '300px' }}
                            className="form-control"
                            mask="(99) 99999-9999"
                            maskChar="_"
                            placeholder="(99) 99999-9999"
                            name="celular"
                            value={aluno.celular}
                            onChange={manipularMudancas}
                            pattern="\(\d{2}\) \d{5}-\d{4}"
                        />
                        <Form.Control.Feedback type="invalid">
                            O celular deve estar no formato (99) 99999-9999.
                        </Form.Control.Feedback>
                        {aluno.celular.length == 15 && !validarCelular(aluno.celular) && (
                            <Form.Text className="text-danger">
                                Celular inválido.
                            </Form.Text>
                        )}
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
                        maxLength={255}
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
