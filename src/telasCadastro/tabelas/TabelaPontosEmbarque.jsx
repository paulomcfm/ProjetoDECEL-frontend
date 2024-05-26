import React, { useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarPontosEmbarque, removerPontoEmbarque } from '../../redux/pontosEmbarqueReducer';
import { useEffect } from 'react';
import ModalExcluir from '../../templates/ModalExcluir';

export default function TabelaPontosEmbarque(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const [pontoEmbarqueSelecionado, setPontoEmbarqueSelecionado] = useState(null); 
    const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
    const { pontosEmbarque } = useSelector(state => state.pontoEmbarque);
    const dispatch = useDispatch();

    const PontoEmbarqueVazio = {
        codigo: '0',
        rua: '',
        numero: '',
        bairro: '',
        cep: ''
    };

    function excluirPontoEmbarque(pontoEmbarque) {
        setPontoEmbarqueSelecionado(pontoEmbarque);
        setMostrarModalExcluir(true);
    }

    function confirmarExclusao() {
        dispatch(removerPontoEmbarque(pontoEmbarqueSelecionado)).then((retorno) => {
            if (retorno.payload.status) {
                props.setMensagem('Ponto de embarque excluído com sucesso!');
                props.setTipoMensagem('success');
                props.setMostrarMensagem(true);
            } else {
                props.setMensagem('Ponto de embarque não excluído! ' + retorno.payload.mensagem);
                props.setTipoMensagem('danger');
                props.setMostrarMensagem(true);
            }
        });
        setMostrarModalExcluir(false);
    }

    function editarPontoEmbarque(pontoEmbarque) {
        props.setPontoEmbarqueParaEdicao(pontoEmbarque);
        props.setModoEdicao(true);
        props.exibirFormulario(true);
    }

    useEffect(() => {
        dispatch(buscarPontosEmbarque());
    }, [dispatch]);

    const pontoEmbarqueFiltrados = pontosEmbarque.filter(pontoEmbarque =>
        pontoEmbarque.rua.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <Container>
            <Button
                type="button"
                className="d-flex align-items-center mb-4 mt-2 mx-auto justify-content-center"
                style={{ width: '142px' }}
                onClick={() => {
                    props.setPontoEmbarqueParaEdicao(PontoEmbarqueVazio);
                    props.exibirFormulario(true);
                }}
            >
                Cadastrar Ponto de Embarque
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
                    placeholder="Buscar pontos de embarque..."
                    value={termoBusca}
                    onChange={e => setTermoBusca(e.target.value)}
                />
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Endereço</th>
                        <th>CEP</th>
                        <th style={{ width: '9%' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pontoEmbarqueFiltrados.map(pontoEmbarque => (
                        <tr key={pontoEmbarque.codigo}>
                            <td>{pontoEmbarque.rua}, {pontoEmbarque.numero}, {pontoEmbarque.bairro}</td>
                            <td>{pontoEmbarque.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}</td>
                            <td>
                                <Button variant="danger" onClick={() => {
                                    excluirPontoEmbarque(pontoEmbarque);
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
                                    editarPontoEmbarque(pontoEmbarque);
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
                <ModalExcluir
                    mostrarModalExcluir={mostrarModalExcluir}
                    mensagemExcluir="Deseja realmente excluir este ponto de embarque?"
                    onConfirmar={confirmarExclusao}
                    onCancelar={() => setMostrarModalExcluir(false)}
                />
            </Table>
        </Container>
    );
}
