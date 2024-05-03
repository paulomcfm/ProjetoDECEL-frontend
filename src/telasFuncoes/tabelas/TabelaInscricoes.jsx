import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal, Form, ModalFooter } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarEscolas } from '../../redux/escolaReducer';
import { buscarPontosEmbarque } from '../../redux/pontosEmbarqueReducer';
import { buscarInscricoes, removerInscricao } from '../../redux/inscricaoReducer';
import { buscarAlunos } from '../../redux/alunoReducer';
import { MdFilterListAlt } from "react-icons/md";
import ModalExcluir from '../../templates/ModalExcluir';

export default function TabelaInscricoes(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const { inscricoes } = useSelector(state => state.inscricao);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
    const [anosSelecionados, setAnosSelecionados] = useState([]);
    const [inscricaoSelecionada, setInscricaoSelecionada] = useState(null);
    const [inscricoesFiltradas, setInscricoesFiltradas] = useState([]);
    const dispatch = useDispatch();

    function obterAnosInscricoes(inscricoes) {
        const anos = inscricoes.map(inscricao => inscricao.ano);
        return [...new Set(anos)];
    }

    const anosDisponiveis = obterAnosInscricoes(inscricoes);

    const inscricaoVazia = {
        codigo: '0',
        ano: '',
        ensino: '',
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
    };

    useEffect(() => {
        dispatch(buscarInscricoes());
        dispatch(buscarPontosEmbarque());
        dispatch(buscarEscolas());
        dispatch(buscarAlunos());
    }, [dispatch]);

    useEffect(() => {
        if (inscricoes.length > 0) {
            const anos = obterAnosInscricoes(inscricoes);
            anos.sort((a, b) => b - a);
            if (anos.length > 0) {
                setAnosSelecionados([anos[0]]);
            }
        }
    }, [inscricoes]);

    useEffect(() => {
        const inscricoesFiltradasPorAno = inscricoes.filter(inscricao =>
            anosSelecionados.includes(inscricao.ano)
        );
        setInscricoesFiltradas(inscricoesFiltradasPorAno);
    }, [inscricoes, anosSelecionados]);

    useEffect(() => {
        const termoBuscaLowerCase = termoBusca.toLowerCase().trim();

        let inscricoesFiltradasPelosAnos = inscricoes.filter(inscricao =>
            anosSelecionados.includes(inscricao.ano)
        );

        let inscricoesFiltradasPeloTermo = inscricoesFiltradasPelosAnos;

        if (termoBuscaLowerCase !== '') {
            inscricoesFiltradasPeloTermo = inscricoesFiltradasPelosAnos.filter(inscricao =>
                inscricao.aluno.nome.toLowerCase().includes(termoBuscaLowerCase)
            );
        }

        setInscricoesFiltradas(inscricoesFiltradasPeloTermo);
    }, [inscricoes, termoBusca, anosSelecionados]);



    const { pontosEmbarque } = useSelector(state => state.pontoEmbarque);
    const { escolas } = useSelector(state => state.escola);
    const { alunos } = useSelector(state => state.aluno);

    function editarInscricao(inscricao) {
        props.setInscricaoParaEdicao(inscricao);
        props.setModoEdicao(true);
        props.exibirFormulario(true);
    }

    function excluirInscricao(inscricao) {
        setInscricaoSelecionada(inscricao);
        setMostrarModalExcluir(true);
    }

    function confirmarExclusao() {
        dispatch(removerInscricao(inscricaoSelecionada)).then((retorno) => {
            if (retorno.payload.status) {
                props.setMensagem('Inscrição excluída com sucesso!');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
            } else {
                props.setMensagem('Inscrição não excluída! ' + retorno.payload.mensagem);
                props.setTipoMensagem('danger');
                props.setMostrarMensagem(true);
            }
        });
        setMostrarModalExcluir(false); 
    }

    return (
        <Container>
            <Button
                type="button"
                className="d-flex align-items-center mb-4 mt-2 mx-auto justify-content-center"
                style={{ width: '142px' }}
                onClick={() => {
                    props.setInscricaoParaEdicao(inscricaoVazia);
                    props.setModoEdicao(false);
                    props.exibirFormulario(true);
                }}
            >
                Inscrever Aluno
            </Button>
            <div className="mb-5 d-flex align-items-center justify-content-center">
                <div className="input-group" style={{ width: '750px' }}>
                    <input
                        type="text"
                        className="form-control"
                        style={{
                            borderRadius: '10px 0 0 10px',
                            padding: '12px 16px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #ced4da',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        }}
                        placeholder="Buscar inscrições pelo nome do aluno..."
                        value={termoBusca}
                        onChange={e => setTermoBusca(e.target.value)}
                    />
                    <div className="input-group-append">
                        <Button
                            onClick={() => setMostrarModal(true)}
                            style={{
                                borderRadius: '0 8px 8px 0',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #ced4da',
                                height: '100%',
                                width: '100%'
                            }}
                        >
                            <MdFilterListAlt />
                        </Button>
                    </div>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Aluno</th>
                        <th>RG</th>
                        <th>Endereço</th>
                        <th>Ponto de Embarque</th>
                        <th>Escola</th>
                        <th>Turma</th>
                        <th>Etapa</th>
                        <th>Período</th>
                        <th>Ano</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {inscricoesFiltradas.map(inscricao => (
                        <tr key={`${inscricao.aluno.codigo}-${inscricao.ano}`}>
                            <td>{alunos ? alunos.find(alu => alu.codigo === inscricao.aluno.codigo)?.nome : 'Carregando...'}</td>
                            <td>{alunos ? alunos.find(alu => alu.codigo === inscricao.aluno.codigo)?.rg : 'Carregando...'}</td>
                            <td>{inscricao.rua}, {inscricao.numero}, {inscricao.bairro}, {inscricao.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}</td>
                            <td>{pontosEmbarque ? pontosEmbarque.find(ponto => ponto.codigo === inscricao.pontoEmbarque.codigo)?.rua : 'Carregando...'}, {pontosEmbarque ? pontosEmbarque.find(ponto => ponto.codigo === inscricao.pontoEmbarque.codigo)?.numero : 'Carregando...'}, {pontosEmbarque ? pontosEmbarque.find(ponto => ponto.codigo === inscricao.pontoEmbarque.codigo)?.bairro : 'Carregando...'}, {pontosEmbarque ? pontosEmbarque.find(ponto => ponto.codigo === inscricao.pontoEmbarque.codigo)?.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2') : 'Carregando...'}</td>
                            <td>{escolas ? escolas.find(esc => esc.codigo === inscricao.escola.codigo)?.nome : 'Carregando...'}</td>
                            <td>
                                {inscricao.anoLetivo === '1I'
                                    ? 'Pré 1' :
                                    inscricao.anoLetivo === '2I'
                                        ? 'Pré 2' :
                                        inscricao.anoLetivo.includes('1')
                                            ? '1º Ano' :
                                            inscricao.anoLetivo.includes('2')
                                                ? '2º Ano'
                                                : inscricao.anoLetivo.includes('3')
                                                    ? '3º Ano'
                                                    : inscricao.anoLetivo.includes('4')
                                                        ? '4º Ano'
                                                        : inscricao.anoLetivo.includes('5')
                                                            ? '5º Ano'
                                                            : inscricao.anoLetivo.includes('6')
                                                                ? '6º Ano'
                                                                : inscricao.anoLetivo.includes('7')
                                                                    ? '7º Ano'
                                                                    : inscricao.anoLetivo.includes('8')
                                                                        ? '8º Ano'
                                                                        : inscricao.anoLetivo.includes('9')
                                                                            ? '9º Ano'
                                                                            : ''} {inscricao.turma}
                            </td>
                            <td>{inscricao.etapa === 'I'
                                ? 'Educação Infantil'
                                : inscricao.etapa === 'F'
                                    ? 'Ensino Fundamental'
                                    : inscricao.etapa === 'M'
                                        ? 'Ensino Médio'
                                        : ''} {inscricao.etapa === 'F' ?
                                            (inscricao.anoLetivo.includes('1') ||
                                                inscricao.anoLetivo.includes('2') ||
                                                inscricao.anoLetivo.includes('3') ||
                                                inscricao.anoLetivo.includes('4') ||
                                                inscricao.anoLetivo.includes('5') ||
                                                inscricao.anoLetivo.includes('6'))
                                                ? 'I'
                                                : 'II'
                                            : ''}
                            </td>
                            <td>{inscricao.periodo === 'M'
                                ? 'Matinal'
                                : inscricao.periodo === 'V'
                                    ? 'Vespertino'
                                    : inscricao.periodo === 'I'
                                        ? 'Integral'
                                        : ''}
                            </td>
                            <td>{inscricao.ano}</td>
                            <td style={{ width: '106px', alignItems: 'center', justifyContent: 'center' }}>
                                <Button variant="danger" onClick={() => {
                                    excluirInscricao(inscricao);
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-trash"
                                        viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                    </svg>
                                </Button> {' '}
                                <Button onClick={() => {
                                    editarInscricao(inscricao);
                                }

                                } variant="warning">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-pencil-square"
                                        viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                    <Modal.Header closeButton>
                        Selecione o(s) ano(s) para filtrar a busca:
                    </Modal.Header>
                    <Modal.Body>
                        {anosDisponiveis.map(ano => (
                            <Form.Check
                                key={ano}
                                inline
                                label={ano}
                                checked={anosSelecionados.includes(ano)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAnosSelecionados([...anosSelecionados, ano]);
                                    } else {
                                        setAnosSelecionados(anosSelecionados.filter(item => item !== ano));
                                    }
                                }}
                            />
                        ))}
                        <Form.Check
                            inline
                            label="Selecionar todos os anos"
                            checked={anosSelecionados.length === anosDisponiveis.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setAnosSelecionados(anosDisponiveis);
                                } else {
                                    setAnosSelecionados([]);
                                }
                            }}
                        />
                    </Modal.Body>
                    <ModalFooter className="justify-content-center">
                        <Button onClick={() => setMostrarModal(false)} variant="primary">Ok</Button>
                    </ModalFooter>
                </Modal>
                <ModalExcluir
                    mostrarModalExcluir={mostrarModalExcluir}
                    mensagemExcluir="Deseja realmente excluir esta inscrição?"
                    onConfirmar={confirmarExclusao}
                    onCancelar={() => setMostrarModalExcluir(false)}
                />
            </Table>
        </Container>
    );
}
