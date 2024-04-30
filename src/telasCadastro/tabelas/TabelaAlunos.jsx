import React, { useState } from 'react';
import { Button, Container, Table, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarAlunos, removerAluno } from '../../redux/alunoReducer';
import { buscarParentescosAluno } from '../../redux/parentescoReducer';
import { useEffect } from 'react';
import { format } from 'date-fns';

export default function TabelaAlunos(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const { estado, mensagem, alunos } = useSelector(state => state.aluno);
    const { estadoPar, mensagemPar, parentescos } = useSelector(state => state.parentesco);
    const { estadoResp, mensagemResp, responsaveis } = useSelector(state => state.responsavel);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [excluir, setExcluir] = useState(false);
    const dispatch = useDispatch();

    const alunoVazio = {
        codigo: '0',
        nome: '',
        rg: '',
        observacoes: '',
        dataNasc: '',
        celular: '',
        responsaveis: []
    };

    function excluirAluno(aluno) {
        setAlunoSelecionado(aluno);
        setMostrarModal(true);
    }

    function handleExcluir() {
        dispatch(removerAluno(alunoSelecionado)).then((retorno) => {
            if (retorno.payload.status) {
                props.setMensagem('Aluno excluído com sucesso!');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
            } else {
                props.setMensagem('Aluno não excluído! ' + retorno.payload.mensagem);
                props.setTipoMensagem('danger');
                props.setMostrarMensagem(true);
            }
        });
        setMostrarModal(false);
    }

    function editarAluno(aluno) {
        dispatch(buscarParentescosAluno(aluno.codigo)).then((retorno) => {
            if (retorno.payload.status) {
                const parentescos = retorno.payload.listaParentescos;
                const responsaveis = parentescos.map(parentesco => ({
                    codigoResponsavel: parentesco.codigoResponsavel,
                    parentesco: parentesco.parentesco
                }));
                const alunoComResponsaveis = {
                    ...aluno,
                    responsaveis: responsaveis
                };
                props.setAlunoParaEdicao(alunoComResponsaveis);
                props.setModoEdicao(true);
                props.exibirFormulario(true);
            }
        });
    }

    useEffect(() => {
        dispatch(buscarAlunos());
    }, [dispatch]);
    
    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <Container>
            <Button
                type="button"
                className="d-flex align-items-center mb-4 mt-2 mx-auto"
                style={{ width: '142px' }}
                onClick={() => {
                    props.setAlunoParaEdicao(alunoVazio);
                    props.exibirFormulario(true);
                }}
            >
                Cadastrar Aluno
            </Button>
            <div className="mb-5 d-flex justify-content-center align-items-center">
                <input
                    type="text"
                    className="form-control"
                    style={{
                        borderRadius: '8px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        width: '750px',
                    }}
                    placeholder="Buscar alunos..."
                    value={termoBusca}
                    onChange={e => setTermoBusca(e.target.value)}
                />
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>RG</th>
                        <th>Data de Nascimento</th>
                        <th>Celular</th>
                        <th>Observações</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {alunosFiltrados.map(aluno => (
                        <tr key={aluno.codigo}>
                            <td>{aluno.nome}</td>
                            <td>{aluno.rg}</td>
                            <td>{format(new Date(aluno.dataNasc), 'dd/MM/yyyy')}</td>
                            <td>{aluno.celular}</td>
                            <td>{aluno.observacoes}</td>
                            <td>
                                <Button variant="danger" onClick={() => {
                                    excluirAluno(aluno);
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
                                    editarAluno(aluno);
                                }

                                } variant="warning">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-pencil-square"
                                        viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deseja realmente excluir o aluno?</Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="danger" onClick={handleExcluir}>Sim</Button>
                    <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
