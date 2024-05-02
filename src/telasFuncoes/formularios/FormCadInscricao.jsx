import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import '../../templates/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { buscarEscolas } from '../../redux/escolaReducer';
import { buscarAlunos } from '../../redux/alunoReducer';
import { buscarPontosEmbarque } from '../../redux/pontosEmbarqueReducer';
import { adicionarInscricao, atualizarInscricao } from '../../redux/inscricaoReducer';
import { format } from 'date-fns';

function FormCadInscricao(props) {
    const { inscricoes } = useSelector(state => state.inscricao);
    const [formValidado, setFormValidado] = useState(false);
    const estadoInicialInscricao = {
        ...props.inscricaoParaEdicao,
        ano: new Date().getFullYear()
    };
    const [inscricao, setInscricao] = useState(estadoInicialInscricao);
    const [alunoSelecionado, setAlunoSelecionado] = useState(false);
    const [escolaSelecionada, setEscolaSelecionada] = useState(false);
    const [pontoEmbarqueSelecionado, setPontoEmbarqueSelecionado] = useState(false);

    const inscricaoVazia = {
        ano: '',
        etapa: '',
        periodo: '',
        turma: '',
        anoLetivo: '',
        rua: '',
        numero: '',
        bairro: '',
        cep: '',
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
            PontosEmbarque: [],
            email: '',
            telefone: ''
        }
    };
    const dispatch = useDispatch();
    const { escolas } = useSelector(state => state.escola);
    const [termoBuscaEscolas, setTermoBuscaEscolas] = useState('');

    useEffect(() => {
        dispatch(buscarEscolas());
    }, [dispatch]);

    const escolasFiltradas = escolas.filter(escola =>
        escola.nome.toLowerCase().includes(termoBuscaEscolas.toLowerCase())
    );

    const handleSelecionarEscola = (escola) => {
        setTermoBuscaEscolas(`${escola.nome}`);
        setInscricao({ ...inscricao, escola: escola });
        setEscolaSelecionada(true);
    };

    const { alunos } = useSelector(state => state.aluno);
    const [termoBuscaAlunos, setTermoBuscaAlunos] = useState('');

    useEffect(() => {
        dispatch(buscarAlunos());
    }, [dispatch]);

    const anoAtual = new Date().getFullYear();

    const alunosFiltrados = alunos.filter(aluno =>
        (aluno.nome.toLowerCase().includes(termoBuscaAlunos.toLowerCase()) ||
            aluno.rg.includes(termoBuscaAlunos)) &&
        !inscricoes.some(inscricao => inscricao.aluno.codigo === aluno.codigo && inscricao.ano === anoAtual)
    );

    const handleSelecionarAluno = async (aluno) => {
        setTermoBuscaAlunos(`${aluno.nome} - ${aluno.rg}`);
        const inscricaoAnoPassado = await buscarInscricaoAnoPassado(aluno.codigo);
        if (inscricaoAnoPassado) {
            setInscricao({ ...inscricao, ...inscricaoAnoPassado, aluno: aluno });
            setCepRaw(inscricaoAnoPassado.cep);
        } else {
            setInscricao({ ...inscricao, aluno: aluno });
        }
        setAlunoSelecionado(true);
    };


    const { pontosEmbarque } = useSelector(state => state.pontoEmbarque);
    const [termoBuscaPontosEmbarque, setTermoBuscaPontosEmbarque] = useState('');

    useEffect(() => {
        dispatch(buscarPontosEmbarque());
    }, [dispatch]);

    const pontosEmbarqueFiltrados = pontosEmbarque.filter(pontosEmbarque =>
        pontosEmbarque.rua.toLowerCase().includes(termoBuscaPontosEmbarque.toLowerCase()) ||
        pontosEmbarque.cep.includes(termoBuscaPontosEmbarque)
    );

    const handleSelecionarPontoEmbarque = (pontoEmbarque) => {
        setTermoBuscaPontosEmbarque(`${pontoEmbarque.rua}, ${pontoEmbarque.numero}, ${pontoEmbarque.bairro} - ${pontoEmbarque.cep}`);
        setInscricao({ ...inscricao, pontoEmbarque: pontoEmbarque });
        setPontoEmbarqueSelecionado(true);
    };

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setInscricao({ ...inscricao, [componente.name]: componente.value });
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (cepRaw) {
            inscricao.cep = cepRaw;
            if (alunoSelecionado && escolaSelecionada && pontoEmbarqueSelecionado) {
                if (form.checkValidity()) {
                    if (inscricao.anoLetivo.includes('M'))
                        inscricao.etapa = 'M';
                    else if (inscricao.anoLetivo.includes('F'))
                        inscricao.etapa = 'F';
                    else
                        inscricao.etapa = 'I';
                    if (!props.modoEdicao) {
                        dispatch(adicionarInscricao(inscricao));
                        props.setMensagem('Inscrição incluída com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        props.exibirFormulario(false);
                    } else {
                        dispatch(atualizarInscricao(inscricao));
                        props.setMensagem('Inscrição alterada com sucesso');
                        props.setTipoMensagem('success');
                        props.setMostrarMensagem(true);
                        props.setModoEdicao(false);
                        props.exibirFormulario(false);
                        props.setInscricaoParaEdicao(inscricaoVazia);
                    }
                    setInscricao(inscricaoVazia);
                    setFormValidado(false);
                }
                else {
                    setFormValidado(true);
                }
            }
            else {
                setFormValidado(true);
            }
        }
        else {
            setFormValidado(true);
        }
        e.stopPropagation();
        e.preventDefault();
    }

    const [cepRaw, setCepRaw] = useState('');

    async function manipularMudancasCEP(event) {
        let cep = String(event.target.value);
        cep = cep.replace(/\D/g, '');
        setCepRaw(cep);

        if (cep.length === 8) {
            const enderecoData = await consultarCEP(cep);
            if (enderecoData) {
                setInscricao({
                    ...inscricao,
                    rua: enderecoData.logradouro || '',
                    bairro: enderecoData.bairro || '',
                    cidade: enderecoData.localidade || ''
                });
            }
        }
    }

    useEffect(() => {
        if (props.modoEdicao) {
            setCepRaw(inscricao.cep);
        }
    }, [props.modoEdicao, inscricao.cep]);

    function formatarCEP(cep) {
        cep = cep.replace(/\D/g, '');

        if (cep.length >= 5) {
            cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
        }

        return cep;
    }


    async function consultarCEP(cep) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao consultar o CEP:', error);
            return null;
        }
    }

    useEffect(() => {
        if (props.modoEdicao) {
            setTermoBuscaPontosEmbarque(`${inscricao.pontoEmbarque?.rua}, ${inscricao.pontoEmbarque.numero}, ${inscricao.pontoEmbarque.bairro} - ${inscricao.pontoEmbarque?.cep}`);
            setTermoBuscaEscolas(inscricao.escola?.nome);
            setAlunoSelecionado(true);
            setEscolaSelecionada(true);
            setPontoEmbarqueSelecionado(true);
        }
    }, [props.modoEdicao, inscricao]);

    async function buscarInscricaoAnoPassado(alunoCodigo) {
        const anoPassado = new Date().getFullYear() - 1;
        const inscricaoAnoPassado = inscricoes.find(inscricao =>
            inscricao.aluno.codigo === alunoCodigo && inscricao.ano === anoPassado
        );
        return inscricaoAnoPassado;
    }

    return (
        <Container className="mt-4 mb-4">
            <h2 className="text-center">Inscrever Aluno</h2>
            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Form.Group className="mb-3">
                    <Form.Label>Aluno(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nome ou RG"
                        value={props.modoEdicao ? (inscricao.aluno?.nome + ' - ' + inscricao.aluno?.rg) : termoBuscaAlunos}
                        onChange={(e) => setTermoBuscaAlunos(e.target.value)}
                        disabled={props.modoEdicao}
                        isInvalid={formValidado && !alunoSelecionado}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Por favor, selecione um aluno.
                    </Form.Control.Feedback>
                </Form.Group>
                {termoBuscaAlunos.length > 0 && (
                    <Table striped bordered hover className="table-white" variant="white">
                        <tbody>
                            {alunosFiltrados.map(aluno => (
                                <tr key={aluno.codigo} onClick={() => handleSelecionarAluno(aluno)} style={{ alignItems: 'center' }}>
                                    <OverlayTrigger
                                        trigger="hover"
                                        key="bottom"
                                        placement="bottom"
                                        overlay={
                                            <Popover id="popover-positioned-bottom">
                                                <Popover.Header as="h3">{aluno.nome}</Popover.Header>
                                                <Popover.Body>
                                                    <p>RG: {aluno.rg}</p>
                                                    <p>Data de Nascimento: {format(new Date(aluno.dataNasc), 'dd/MM/yyyy')}</p>
                                                    <p>Celular: {aluno.celular}</p>
                                                    <p>Observações: {aluno.observacoes}</p>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <td style={{ textAlign: 'center' }}>{aluno.nome} - {aluno.rg}</td>
                                    </OverlayTrigger>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Ponto de Embarque(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por rua ou CEP"
                        value={termoBuscaPontosEmbarque}
                        onChange={(e) => setTermoBuscaPontosEmbarque(e.target.value)}
                        isInvalid={formValidado && !pontoEmbarqueSelecionado}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Por favor, selecione um ponto de embarque.
                    </Form.Control.Feedback>
                </Form.Group>
                {termoBuscaPontosEmbarque.length > 0 && (
                    <Table striped bordered hover className="table-white" variant="white">
                        <tbody>
                            {pontosEmbarqueFiltrados.map(pontosEmbarque => (
                                <tr key={pontosEmbarque.codigo} onClick={() => handleSelecionarPontoEmbarque(pontosEmbarque)} style={{ alignItems: 'center' }}>
                                    <td style={{ textAlign: 'center' }}>{pontosEmbarque.rua}, {pontosEmbarque.numero}, {pontosEmbarque.bairro}, {pontosEmbarque.cep}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                )}
                <Form.Group className="mb-3">
                    <Form.Label>Escola(*):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nome"
                        value={termoBuscaEscolas}
                        onChange={(e) => {
                            setTermoBuscaEscolas(e.target.value)
                        }}
                        isInvalid={formValidado && !escolaSelecionada}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Por favor, selecione uma escola.
                    </Form.Control.Feedback>
                </Form.Group>
                {(termoBuscaEscolas.length > 0 && !escolaSelecionada) && (
                    <Table striped bordered hover className="table-white" variant="white">
                        <tbody>
                            {escolasFiltradas.map(escola => (
                                <tr key={escola.codigo} onClick={() => handleSelecionarEscola(escola)} style={{ alignItems: 'center' }}>
                                    <td style={{ textAlign: 'center' }}>{escola.nome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {((alunoSelecionado && escolaSelecionada && pontoEmbarqueSelecionado) || props.modoEdicao) && (
                    <>
                        <Row>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CEP(*):</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="XXXXX-XXX"
                                        id="cep"
                                        name="cep"
                                        value={formatarCEP(cepRaw)}
                                        onChange={manipularMudancasCEP}
                                        maxLength="9"
                                        onInvalid={!cepRaw && formValidado}
                                        required />
                                </Form.Group>
                                <Form.Control.Feedback type="invalid">
                                    Por favor, informe o CEP.
                                </Form.Control.Feedback>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rua(*):</Form.Label>
                                    <Form.Control
                                        placeholder="Rua do endereço do aluno"
                                        type="text"
                                        id="rua"
                                        name="rua"
                                        value={inscricao.rua}
                                        onChange={manipularMudancas}
                                        required />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, informe a rua.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número(*):</Form.Label>
                                    <Form.Control
                                        placeholder="Número"
                                        type="text"
                                        id="numero"
                                        name="numero"
                                        value={inscricao.numero}
                                        onChange={manipularMudancas}
                                        required />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, informe o número.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bairro(*):</Form.Label>
                                    <Form.Control
                                        placeholder="Bairro do endereço do aluno"
                                        type="text"
                                        id="bairro"
                                        name="bairro"
                                        value={inscricao.bairro}
                                        onChange={manipularMudancas}
                                        required />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, informe o bairro.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Período Escolar(*):</Form.Label>
                                    <Form.Select aria-label="Selecione..."
                                        id='periodo'
                                        name='periodo'
                                        value={inscricao.periodo}
                                        onChange={manipularMudancas}
                                        required>
                                        <option value="">Selecione...</option>
                                        <option value='M'>Matinal</option>
                                        <option value='V'>Vespertino</option>
                                        <option value='I'>Integral</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, selecione o período.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ano Letivo(*):</Form.Label>
                                    <Form.Select aria-label="Selecione..."
                                        id='anoLetivo'
                                        name='anoLetivo'
                                        value={inscricao.anoLetivo}
                                        onChange={manipularMudancas}
                                        required>
                                        <option value="">Selecione...</option>
                                        <option value='1I'>Pré 1</option>
                                        <option value='2I'>Pré 2</option>
                                        <option value='1F'>1° ano</option>
                                        <option value='2F'>2° ano</option>
                                        <option value='3F'>3° ano</option>
                                        <option value='4F'>4° ano</option>
                                        <option value='5F'>5° ano</option>
                                        <option value='6F'>6° ano</option>
                                        <option value='7F'>7° ano</option>
                                        <option value='8F'>8° ano</option>
                                        <option value='9F'>9° ano</option>
                                        <option value='1M'>1° ano do Ensino Médio</option>
                                        <option value='2M'>2° ano do Ensino Médio</option>
                                        <option value='3M'>3° ano do Ensino Médio</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, selcione o ano letivo.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Turma(*):</Form.Label>
                                    <Form.Select aria-label="Selecione..."
                                        id='turma'
                                        name='turma'
                                        value={inscricao.turma}
                                        onChange={manipularMudancas}
                                        required>
                                        <option value="">Selecione...</option>
                                        <option value='A'>A</option>
                                        <option value='B'>B</option>
                                        <option value='C'>C</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, selecione a turma.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                )}
                <p>(*) Campos obrigatórios</p>
                <Row>
                    <div className="d-flex justify-content-center">
                        <Button type="submit" variant="primary">
                            {props.modoEdicao ? "Alterar Inscricao" : "Inscrever Aluno"}
                        </Button>
                        <Button type="submit" variant="danger" className="ms-2" onClick={() => {
                            props.exibirFormulario(false);
                            props.setModoEdicao(false);
                        }}>
                            Voltar
                        </Button>
                    </div>
                </Row>
            </Form>
        </Container>
    );
}

export default FormCadInscricao;
