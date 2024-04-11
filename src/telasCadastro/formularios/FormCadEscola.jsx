import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { adicionarEscola, atualizarEscola } from '../../redux/escolaReducer';
import { useSelector, useDispatch } from 'react-redux';

export default function FormCadEscolas(props) {

    const escolaVazia = {
        nome: '',
        tipo: '',
        rua: '',
        numero: '',
        cidade: '',
        bairro: '',
        cep: '',
        email:'',
        telefone: ''
    }

    const estadoInicialEscola = props.escolaParaEdicao;
    const [escola, setEscola] = useState(estadoInicialEscola);
    const [formValidado, setFormValidado] = useState(false);
    const { estado, mensagem, escolas } = useSelector((state) => state.escola);
    const dispatch = useDispatch();

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        let valor = componente.value;

        if (componente.name === 'telefone') {
            valor = formatarTelefone(valor);
        }

        setEscola({ ...escola, [componente.name]: valor });
    }

    function manipularMudancasTelefone(e) {
        let telefone = e.target.value;
        telefone = formatarTelefone(telefone);
        setEscola({ ...escola, telefone: telefone });
    }

    async function manipularMudancasCEP(event) {
        let cep = String(event.target.value); // Converte para string
        cep = cep.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        cep = formatarCEP(cep); // Formata o CEP com hífen (se tiver mais de 5 dígitos)

        // Atualiza o estado da escola com o valor formatado do CEP
        setEscola({
            ...escola,
            cep: cep
        });

        // Se o CEP estiver completo, preenche os demais campos
        if (cep.length === 9) {
            const enderecoData = await consultarCEP(cep.replace('-', ''));
            if (enderecoData) {
                setEscola({
                    ...escola,
                    rua: enderecoData.logradouro || '',
                    bairro: enderecoData.bairro || '',
                    cidade: enderecoData.localidade || ''
                });
            }
        }
    }

    function formatarTelefone(telefone) {
        if (!telefone) return telefone;
        // Remove todos os caracteres não numéricos
        telefone = telefone.replace(/\D/g, '');

        // Verifica se o telefone tem menos de 11 dígitos
        if (telefone.length < 11) {
            // Aplica a máscara para telefones com menos de 11 dígitos (xx) xxxx-xxxx
            telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else {
            // Aplica a máscara para telefones com 11 dígitos (xx) x xxxx-xxxx
            telefone = telefone.replace(/^(\d{2})(\d)(\d{4})(\d{0,4})$/, '($1) $2 $3-$4');
        }

        return telefone;
    }

    function formatarCEP(cep) {
        cep = cep.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

        // Formata o CEP com hífen (se tiver mais de 5 dígitos)
        if (cep.length > 5) {
            cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
        }

        return cep;
    }

    function manipularSubmissao(e) {
        const form = e.currentTarget;
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

        e.stopPropagation();
        e.preventDefault();
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
                            <Form.Label>CEP(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="00000-000"
                                id="cep"
                                name="cep"
                                value={escola.cep}
                                onChange={manipularMudancasCEP}
                                maxLength="9"
                                required />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rua(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Rua"
                                id="endereco"
                                name="endereco"
                                value={escola.rua}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Número(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Número"
                                id="numero"
                                name="numero"
                                value={escola.numero}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cidade(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Cidade"
                                id="cidade"
                                name="cidade"
                                value={escola.cidade}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Bairro(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Bairro"
                                id="cep"
                                name="cep"
                                value={escola.bairro}
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
                <Row>
                    <Col md={9}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                id="email"
                                name="email"
                                value={escola.email}
                                onChange={manipularMudancas}
                                required />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Telefone(*):</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="(00) 00000-0000"
                                id="telefone"
                                name="telefone"
                                value={formatarTelefone(escola.telefone)}
                                onChange={manipularMudancasTelefone}
                                maxLength="16"
                                required />
                        </Form.Group>
                    </Col>
                </Row>
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
