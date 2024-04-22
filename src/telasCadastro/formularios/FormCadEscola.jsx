import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { adicionarEscola, atualizarEscola } from '../../redux/escolaReducer';
import { buscarPontosEmbarque } from '../../redux/pontosEmbarqueReducer';
import { useDispatch, useSelector } from 'react-redux';

export default function FormCadEscolas(props) {
    const { estado, mensagem, escolas } = useSelector(state => state.escola);
    const estadoInicialEscola = props.escolaParaEdicao;
    const [escola, setEscola] = useState(estadoInicialEscola);

    const escolaVazia = {
        codigo: 0,
        nome: '',
        tipo: '',
        email: '',
        telefone: '',
        pontoEmbarque: {
            codigo: 0,
            rua: '',
            numero: '',
            bairro: '',
            cep: ''
        }
    }

    const [termoBusca, setTermoBusca] = useState('');
    const [formValidado, setFormValidado] = useState(false);
    const { estadoPdE, mensagemPdE, pontosEmbarque } = useSelector(state => state.pontoEmbarque);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarPontosEmbarque());
    }, [dispatch]);

    const pontoEmbarqueFiltrados = pontosEmbarque.filter(pontoEmbarque =>
        pontoEmbarque.rua.toLowerCase().includes(termoBusca.toLowerCase()) ||
        pontoEmbarque.cep.includes(termoBusca)
    );

    const handleSelecionarPontoEmbarque = (pontoEmbarque) => {
        setTermoBusca(`${pontoEmbarque.rua}, ${pontoEmbarque.numero}, ${pontoEmbarque.bairro}, ${pontoEmbarque.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}`);
        setEscola({ ...escola, pontoEmbarque: pontoEmbarque });
    };

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        let valor = componente.value;

        if (componente.name === 'telefone') {
            valor = formatarTelefone(valor);
        }

        setEscola({ ...escola, [componente.name]: valor });
    }

    const formatarTelefone = (telefone) => {
        if (!telefone) return telefone;

        let telefoneFormatado = telefone.replace(/\D/g, '');

        telefoneFormatado = telefoneFormatado.substring(0, 10);
        if (telefoneFormatado.length === 8) {
            telefoneFormatado = `${telefoneFormatado.substring(0, 4)}-${telefoneFormatado.substring(4)}`;
        }
        if (telefoneFormatado.length > 2) {
            telefoneFormatado = `(${telefoneFormatado.substring(0, 2)}) ${telefoneFormatado.substring(2)}`;
        }
        if (telefoneFormatado.length > 9) {
            telefoneFormatado = `${telefoneFormatado.substring(0, 9)}-${telefoneFormatado.substring(9)}`;
        }

        return telefoneFormatado;
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (escola.pontoEmbarque != null) {
            if (form.checkValidity()) {
                if (!props.modoEdicao) {
                    dispatch(adicionarEscola(escola));
                    props.setMensagem('Escola incluída com sucesso');
                    props.setTipoMensagem('success');
                    props.setMostrarMensagem(true);
                }
                else {
                    dispatch(atualizarEscola(escola));
                    props.setMensagem('Escola alterada com sucesso');
                    props.setTipoMensagem('success');
                    props.setMostrarMensagem(true);
                    props.setModoEdicao(false);
                    props.setEscolaParaEdicao(escolaVazia);
                }
                setEscola(escolaVazia);
                setFormValidado(false);
            }
            else {
                setFormValidado(true);
            }
        }
        else
            console.log('Selecione um ponto de embarque')

        e.stopPropagation();
        e.preventDefault();
    }
    
    return (
        <>
            <h2 className="text-center">Cadastrar Escola</h2>

            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Row>
                    <Col md={9}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome"
                                id="nome"
                                name="nome"
                                value={escola.nome}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Telefone(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="(00) 0000-0000"
                                id="telefone"
                                name="telefone"
                                value={formatarTelefone(escola.telefone)}
                                onChange={manipularMudancas}
                                maxLength="16"
                                required />
                        </Form.Group>
                    </Col>

                    <Col md={9}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                id="email"
                                name="email"
                                value={(escola.email)}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Selecione o tipo de escola(*):</Form.Label>
                            <Form.Select aria-label="Selecione..."
                                id='tipo'
                                name='tipo'
                                onChange={manipularMudancas}
                                value={escola.tipo}
                                required>
                                <option value="">Selecione...</option>
                                <option value='i'>Educação Infantil</option>
                                <option value='f'>Ensino Fundamental</option>
                                <option value='a'>Ambos</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <div>
                    <Form.Group className="mb-3">
                        <Form.Label>Ponto de Embarque(*):</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por rua ou CEP"
                            value={props.modoEdicao ? (escola.pontoEmbarque?.rua + ', ' + escola.pontoEmbarque?.numero + ', ' + escola.pontoEmbarque?.bairro + ' - ' + escola.pontoEmbarque?.cep) : termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                    </Form.Group>
                    {termoBusca.length > 0 && (
                        <Table striped bordered hover className="table-white" variant="white">
                            <tbody>
                                {pontoEmbarqueFiltrados.map(pontoEmbarque => (
                                    <tr key={pontoEmbarque.codigo} onClick={() => handleSelecionarPontoEmbarque(pontoEmbarque)} style={{ alignItems: 'center' }}>
                                        <td style={{ textAlign: 'center' }}>{pontoEmbarque.rua}, {pontoEmbarque.numero}, {pontoEmbarque.bairro} - {pontoEmbarque.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
                <p>(*) Campos obrigatórios</p>
                <Row className="justify-content-end">
                    <div className="d-flex justify-content-center">
                        <Button type="submit" variant="primary">
                            {props.modoEdicao ? "Alterar" : "Cadastrar"}
                        </Button>
                        <Button type="submit" variant="danger" className="ms-2" onClick={() => props.exibirFormulario(false)}>
                            Voltar
                        </Button>
                    </div>
                </Row>
            </Form>
        </>
    );
}
