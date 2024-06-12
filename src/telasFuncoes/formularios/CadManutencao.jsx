import { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarManutencao, atualizarManutencao, buscarManutencoes } from '../../redux/manutencaoReducer';
import { buscarVeiculos } from '../../redux/veiculoReducer';

const CadastroManutencao = (props) => {
    const manutencaoVazia = {
        tipo: 'preventiva',
        data: '',
        observacoes: '',
        valor: '',
        veiculoCodigo: ''
    };

    const estadoInicialManutencao = props.manutencaoParaEdicao || manutencaoVazia;
    const { setMostrarMensagem, setMensagem, setTipoMensagem } = props;
    const [manutencao, setManutencao] = useState(estadoInicialManutencao);
    const [formValidado, setFormValidado] = useState(false);
    const [placa, setPlaca] = useState('');
    const [observacoesDesabilitado, setObservacoesDesabilitado] = useState(estadoInicialManutencao.tipo === 'preventiva');
    const [placaInexistente, setPlacaInexistente] = useState(false);
    const [erroGeral, setErroGeral] = useState('');

    const { manutencoes } = useSelector((state) => state.manutencao);
    const { veiculos } = useSelector((state) => state.veiculo);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarManutencoes());
        dispatch(buscarVeiculos());
    }, [dispatch]);

    useEffect(() => {
        if (props.manutencaoParaEdicao) {
            const veiculo = veiculos.find(v => v.codigo === props.manutencaoParaEdicao.veiculoCodigo);
            if (veiculo) {
                setPlaca(veiculo.placa);
            }
            const dataFormatada = props.manutencaoParaEdicao.data.split('T')[0]; // Garantir que apenas a data no formato YYYY-MM-DD seja usada
            setManutencao({ ...props.manutencaoParaEdicao, data: dataFormatada });
        }
    }, [props.manutencaoParaEdicao, veiculos]);

    useEffect(() => {
        if (placa) {
            const veiculo = veiculos.find(v => v.placa === placa);
            if (veiculo) {
                setManutencao({ ...manutencao, veiculoCodigo: veiculo.codigo });
                setPlacaInexistente(false);
            } else {
                setManutencao({ ...manutencao, veiculoCodigo: '' });
                setPlacaInexistente(true);
            }
        }
    }, [placa, veiculos, manutencoes]);

    function manipularMudancas(e) {
        const { name, value } = e.currentTarget;
        if (name === 'placa') {
            setPlaca(value);
        } else if (name === 'tipo') {
            const novasObservacoes = value === 'preventiva' ? '' : manutencao.observacoes;
            setManutencao({ ...manutencao, [name]: value, observacoes: novasObservacoes });
            setObservacoesDesabilitado(value === 'preventiva');
        } else {
            setManutencao({ ...manutencao, [name]: value });
        }
    }

    async function manipularSubmissao(e) {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        if (form.checkValidity() && !placaInexistente) {
            if (props.modoEdicao) {
                dispatch(atualizarManutencao(formatarManutencaoParaEnvio(manutencao))).then((retorno) => {
                    setMostrarMensagem(true);
                    setMensagem(retorno.payload.mensagem);
                    setTipoMensagem(retorno.payload.status ? "success" : "danger");
                    if (retorno.payload.status) {
                        limparFormulario();
                    } else {
                        setErroGeral(retorno.payload.mensagem);
                    }
                });
            } else {
                dispatch(adicionarManutencao(formatarManutencaoParaEnvio(manutencao))).then((retorno) => {
                    setMostrarMensagem(true);
                    setMensagem(retorno.payload.mensagem);
                    setTipoMensagem(retorno.payload.status ? "success" : "danger");
                    if (retorno.payload.status) {
                        limparFormulario();
                    } else {
                        setErroGeral(retorno.payload.mensagem);
                    }
                });
            }
            setFormValidado(false);
        } else {
            setFormValidado(true);
        }
    }

    function formatarManutencaoParaEnvio(manutencao) {
        return {
            ...manutencao,
            data: manutencao.data.split('T')[0] // Garantir que apenas a data no formato YYYY-MM-DD seja enviada
        };
    }

    function limparFormulario() {
        setManutencao(manutencaoVazia);
        setFormValidado(false);
    }

    return (
        <>
            <h2 className="text-center">{props.modoEdicao ? 'Alterar Manutenção' : 'Cadastrar Manutenção'}</h2>
            {erroGeral && <Alert variant="danger">{erroGeral}</Alert>}
            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao} id='formManutencao'>
                <Row>
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Placa(*):</Form.Label>
                        <Form.Control
                            as="select"
                            id="placa"
                            name="placa"
                            value={placa}
                            onChange={manipularMudancas}
                            required
                            isInvalid={placaInexistente}
                        >
                            {veiculos.map(veiculo => (
                                <option key={veiculo.codigo} value={veiculo.placa}>
                                    {veiculo.placa}
                                </option>
                            ))}
                        </Form.Control>
                        {placaInexistente && <Form.Text className="text-danger">Este veículo não existe.</Form.Text>}
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Tipo(*):</Form.Label>
                        <Form.Control
                            as="select"
                            id="tipo"
                            name="tipo"
                            value={manutencao.tipo}
                            onChange={manipularMudancas}
                            required
                        >
                            <option value="preventiva">Preventiva</option>
                            <option value="corretiva">Corretiva</option>
                        </Form.Control>
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Data(*):</Form.Label>
                        <Form.Control
                            type="date"
                            id="data"
                            name="data"
                            value={manutencao.data}
                            onChange={manipularMudancas}
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Valor(*):</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            id="valor"
                            name="valor"
                            value={manutencao.valor}
                            onChange={manipularMudancas}
                            required
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Observações:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        id="observacoes"
                        name="observacoes"
                        value={manutencao.observacoes}
                        onChange={manipularMudancas}
                        required={manutencao.tipo === 'corretiva'}
                        disabled={observacoesDesabilitado}
                    />
                </Form.Group>

                <p>(*) Campos obrigatórios</p>

                <Row>
                    <Col md={6} className="d-flex justify-content-end">
                        <Button type="submit" variant="primary" disabled={placaInexistente}>
                            {props.modoEdicao ? "Alterar" : "Cadastrar"}
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={() => props.exibirFormulario(false)}>
                            Voltar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default CadastroManutencao;