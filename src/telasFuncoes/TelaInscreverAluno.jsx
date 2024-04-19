import React, { useState } from 'react';
import { Form, Button, ListGroup, Container, Row, Col } from 'react-bootstrap';
import Pagina from '../templates/Pagina';
import '../templates/style.css';
import { useSelector, useDispatch } from 'react-redux';

function AlunoForm(props) {
    const inscricaoVazia = {
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
    };


    //const [aluno, setAluno]
    const [inscricao, setInscricao] = useState(inscricaoVazia);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, inscricoes } = useSelector((state) => state.inscricao);
    const dispatch = useDispatch();
    const [alunosFiltrados, setAlunosFiltrados] = useState([
        { value: 'aluno1', label: 'Aluno 1' },
        { value: 'aluno2', label: 'Aluno 2' }
    ])
    const [pontoEmbarqueSelecionado, setPontoEmbarqueSelecionado] = useState('');
    const [pontosEmbarqueOriginal, setPontosEmbarqueOriginal] = useState(pontosEmbarque);
    const [queryEscola, setQueryEscola] = useState('');
    const [escolaSelecionada, setEscolaSelecionada] = useState('');
    const [escolasFiltradas, setEscolasFiltradas] = useState([
        { value: 'escola1', label: 'Escola 1' },
        { value: 'escola2', label: 'Escola 2' }
    ]);
    const [escola, setEscola] = useState('');
    const [alunoSelecionado, setAlunoSelecionado] = useState(false);
    const [alunoSelecionadoInfo, setAlunoSelecionadoInfo] = useState('');
    const [queryAluno, setQueryAluno] = useState('');
    const [queryPonto, setQueryPonto] = useState('');
    const [pontosEmbarque, setPontosEmbarque] = useState([
        { value: 'ponto1', label: 'Ponto 1' },
        { value: 'ponto2', label: 'Ponto 2' }
    ])
    function manipularMudancas(e) {
        const componente = e.currentTarget;
        let valor = componente.value;
        setInscricao({ ...inscricao, [componente.name]: valor });
    }

    // function manipularSubmissao(e) {
    //     const form = e.currentTarget;
    //     if (form.checkValidity()) {
    //         dispatch(adicionarInscricao(inscricao));
    //         props.setMensagem('Inscrição incluída com sucesso');
    //         props.setTipoMensagem('success');
    //         props.setMostrarMensagem(true);
    //         setInscricao(inscricaoVazia);
    //         setFormValidado(false);
    //     }
    //     else {
    //         setFormValidado(true);
    //     }
    //     e.stopPropagation();
    //     e.preventDefault();
    // }

    const handleInputChangeAluno = (e) => {
        const inputValue = e.target.value;
        setQueryAluno(inputValue);

        const alunosFiltrados = inscricao.aluno.filter(aluno =>
            aluno.nome.toLowerCase().includes(inputValue.toLowerCase()) ||
            aluno.rg.toLowerCase().includes(inputValue.toLowerCase())
        );
        setAlunosFiltrados(alunosFiltrados);
    };

    const handleAlunoClick = (nome, rg) => {
        setAlunoSelecionado(true);
        setAlunoSelecionadoInfo(`${nome} - ${rg}`);
        setQueryAluno(`${nome} - ${rg}`);
        setAlunosFiltrados([]);
    };

    const handleInputChangePonto = (e) => {
        const inputValue = e.target.value;
        setQueryPonto(inputValue);

        const pontosEmbarqueFiltrados = pontosEmbarqueOriginal.filter(ponto =>
            ponto.nome.toLowerCase().includes(inputValue.toLowerCase())
        );
        setPontosEmbarque(pontosEmbarqueFiltrados.length > 0 ? pontosEmbarqueFiltrados : pontosEmbarqueOriginal);
    };

    const handleEscolaSelect = (escola) => {
        setEscola(escola.label);
        setEscolaSelecionada(escola.label);
        setQueryEscola(escola.label);
        setEscolasFiltradas([]);
    };

    const handleInputChangeEscola = (e) => {
        const inputValue = e.target.value;
        setQueryEscola(inputValue);

        const escolasFiltradas = [
            { value: 'escola1', label: 'Escola Machado' },
            { value: 'escola2', label: 'Escola ABCD' }
        ].filter(escola =>
            escola.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setEscolasFiltradas(escolasFiltradas);
    };

    const handlePontoEmbarqueClick = (id, nome) => {
        setPontoEmbarqueSelecionado(nome);
        setQueryPonto(nome);
    };

    const exibirCamposAluno = () => {
        if (alunoSelecionado && pontoEmbarqueSelecionado && escolaSelecionada) {
            return (
                <div className="campos-aluno">
                    <Row>
                        <Col md={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>CEP(*):</Form.Label>
                                <Form.Control placeholder="XXXXX-XXX" type="text" value={inscricao.cep} onChange={manipularMudancas} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Rua(*):</Form.Label>
                                <Form.Control placeholder="Rua do endereço do aluno" type="text" value={inscricao.rua} onChange={manipularMudancas} required />
                            </Form.Group>
                        </Col>
                        <Col md={1}>
                            <Form.Group className="mb-3">
                                <Form.Label>Número(*):</Form.Label>
                                <Form.Control placeholder="Número" type="text" value={inscricao.numero} onChange={manipularMudancas} required />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Bairro(*):</Form.Label>
                                <Form.Control placeholder="Bairro do endereço do aluno" type="text" value={inscricao.bairro} onChange={manipularMudancas} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Período Escolar(*):</Form.Label>
                                <Form.Select aria-label="Selecione..."
                                    id='periodo'
                                    name='periodo'
                                    value={inscricao.periodo}
                                    onChange={manipularMudancas}
                                    required>
                                    <option value="">Selecione...</option>
                                    <option value='m'>Matinal</option>
                                    <option value='v'>Vespertino</option>
                                    <option value='i'>Integral</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ensino(*):</Form.Label>
                                <Form.Select aria-label="Selecione..."
                                    id='ensino'
                                    name='ensino'
                                    value={inscricao.ensino}
                                    onChange={manipularMudancas}
                                    required>
                                    <option value="">Selecione...</option>
                                    <option value='i'>Educação Infantil</option>
                                    <option value='f'>Ensino Fundamental</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ano Letivo(*):</Form.Label>
                                <Form.Select aria-label="Selecione..."
                                    id='anoLetivo'
                                    name='anoLetivo'
                                    value={inscricao.anoLetivo}
                                    onChange={manipularMudancas}
                                    required>
                                    <option value="">Selecione...</option>
                                    <option value='1'>1° ano</option>
                                    <option value='2'>2° ano</option>
                                    <option value='3'>3° ano</option>
                                    <option value='4'>4° ano</option>
                                    <option value='5'>5° ano</option>
                                    <option value='6'>6° ano</option>
                                    <option value='7'>7° ano</option>
                                    <option value='8'>8° ano</option>
                                    <option value='9'>9° ano</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
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
                            </Form.Group>
                        </Col>
                    </Row>
                </div>
            );
        }
        return null;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Pagina>
            <Container className="mt-4 mb-4">
                <h2 className="text-center">Inscrever Aluno</h2>

                <Form onSubmit={handleFormSubmit}>
                    <Form.Group className="mb-3 text-center">
                        <Form.Label>Aluno(*):</Form.Label>
                        <Form.Control placeholder="Busque a partir do nome ou RG" type="text" value={queryAluno} onChange={handleInputChangeAluno} required />
                    </Form.Group>
                    {queryAluno.length > 0 && (
                        <ListGroup className="result-list text-center">
                            {alunosFiltrados.map((aluno, index) => (
                                <ListGroup.Item
                                    key={index}
                                    action
                                    onClick={() => handleAlunoClick(aluno.nome, aluno.rg)}
                                >
                                    {`${aluno.nome} - ${aluno.rg}`}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                    <Form.Group className="mb-3 text-center">
                        <Form.Label>Ponto de embarque(*):</Form.Label>
                        <Form.Control placeholder="Busque a partir do nome" type="text" value={queryPonto} onChange={handleInputChangePonto} required />
                    </Form.Group>
                    {queryPonto.length > 0 && (pontoEmbarqueSelecionado === '' || queryPonto !== pontoEmbarqueSelecionado) && (
                        <ListGroup className="result-list text-center">
                            {pontosEmbarque.map((ponto, index) => (
                                <ListGroup.Item
                                    key={index}
                                    action
                                    onClick={() => handlePontoEmbarqueClick(ponto.id, ponto.nome)}
                                >
                                    {ponto.nome}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                    <Form.Group className="mb-3 text-center">
                        <Form.Label>Escola(*):</Form.Label>
                        <Form.Control placeholder="Busque a partir do nome" type="text" value={queryEscola} onChange={handleInputChangeEscola} required />
                    </Form.Group>
                    {queryEscola.length > 0 && (
                        <ListGroup className="result-list text-center">
                            {escolasFiltradas.map((escola, index) => (
                                <ListGroup.Item
                                    key={index}
                                    action
                                    onClick={() => handleEscolaSelect(escola)}
                                >
                                    {escola.label}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                    {exibirCamposAluno()}
                    <p>(*) Campos obrigatórios</p>
                    <div className="text-center">
                        <Button className='mt-3' variant="primary" type="submit" disabled={!alunoSelecionado || !pontoEmbarqueSelecionado || !escolaSelecionada || !inscricao.cep || !inscricao.rua || !inscricao.numero || !inscricao.bairro}>
                            Inscrever Aluno
                        </Button>
                    </div>
                </Form>
            </Container>
        </Pagina>
    );
}


export default AlunoForm;
