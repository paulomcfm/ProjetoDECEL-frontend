import React, { useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarEscolas, removerEscola } from '../../redux/escolaReducer';
import { useEffect } from 'react';

export default function TabelaEscolas(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const { estado, mensagem, escolas } = useSelector(state => state.escola);
    const dispatch = useDispatch();

    const escolaVazia = {
        codigo: '0',
        nome: '',
        endereco: '',
        tipo: ''
    };

    function excluirEscola(escola) {
        if (window.confirm('Deseja realmente excluir essa escola?')) {
            dispatch(removerEscola(escola));
        }
    }

    function editarEscola(escola) {
        props.setEscolaParaEdicao(escola);
        props.setModoEdicao(true);
        props.exibirFormulario(true);
    }

    useEffect(() => {
        dispatch(buscarEscolas());
    }, [dispatch]);

    const escolasFiltradas = escolas.filter(escola =>
        escola.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <Container>
            <Button
                type="button"
                className="d-flex align-items-center mb-4 mt-2 mx-auto"
                style={{ width: '142px' }}
                onClick={() => {
                    props.setEscolaParaEdicao(escolaVazia);
                    props.exibirFormulario(true);
                }}
            >
                Cadastrar Escola
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
                    placeholder="Buscar escolas..."
                    value={termoBusca}
                    onChange={e => setTermoBusca(e.target.value)}
                />
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {escolasFiltradas.map(escola => (
                        <tr key={escola.codigo}>
                            <td>{escola.codigo}</td>
                            <td>{escola.nome}</td>
                            <td>{escola.endereco}</td>
                            <td>
                                {escola.tipo === 'i'
                                    ? 'Educação Infantil'
                                    : escola.tipo === 'f'
                                        ? 'Ensino Fundamental'
                                        : escola.tipo === 'a'
                                            ? 'Educação Infantil e Ensino Fundamental'
                                            : ''}
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => {
                                    excluirEscola(escola);
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
                                    editarEscola(escola);
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
        </Container>
    );
}
