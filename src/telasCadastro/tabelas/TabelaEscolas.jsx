import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarEscolas, removerEscola } from '../../redux/escolaReducer';
import { buscarPontosEmbarque } from '../../redux/pontosEmbarqueReducer';
import ModalExcluir from '../../templates/ModalExcluir';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TabelaEscolas(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const { escolas } = useSelector(state => state.escola);
    const [escolaSelecionada, setEscolaSelecionada] = useState(null); 
    const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
    const dispatch = useDispatch();

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

    useEffect(() => {
        dispatch(buscarEscolas());
        dispatch(buscarPontosEmbarque());
    }, [dispatch]);

    const { pontosEmbarque } = useSelector(state => state.pontoEmbarque);

    function excluirEscola(escola) {
        setEscolaSelecionada(escola);
        setMostrarModalExcluir(true);
    }

    function confirmarExclusao() {
        dispatch(removerEscola(escolaSelecionada)).then((retorno) => {
            if (retorno.payload.status) {
                toast.success('Escola excluída com sucesso!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                toast.error('Escola não excluída! ' + retorno.payload.mensagem, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        });
        setMostrarModalExcluir(false); 
    }

    function editarEscola(escola) {
        props.setEscolaParaEdicao(escola);
        props.setModoEdicao(true);
        props.exibirFormulario(true);
    }

    const escolasFiltradas = escolas.filter(escola =>
        escola.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <Container>
            <ToastContainer />
            <Button
                type="button"
                className="d-flex align-items-center mb-4 mt-2 mx-auto justify-content-center"
                style={{ width: '142px' }}
                onClick={() => {
                    props.setEscolaParaEdicao(escolaVazia);
                    props.setModoEdicao(false);
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
            <table className='tabela'>
                <thead className='head-tabela'>
                    <tr>
                        <th className='linhas-titulo-tabela'>Nome</th>
                        <th className='linhas-titulo-tabela'>Endereço</th>
                        <th className='linhas-titulo-tabela'>CEP</th>
                        <th className='linhas-titulo-tabela'>Tipo</th>
                        <th className='linhas-titulo-tabela'>Email</th>
                        <th className='linhas-titulo-tabela'>Telefone</th>
                        <th className='linhas-titulo-tabela'>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {escolasFiltradas.map(escola => (
                        <tr key={escola.codigo}>
                            <td className='linhas-tabela' style={{ width: '15%'}}>{escola.nome}</td>
                            <td className='linhas-tabela'>{pontosEmbarque.find(ponto => ponto.codigo === escola.pontoEmbarque.codigo)?.rua}
                                , {pontosEmbarque.find(ponto => ponto.codigo === escola.pontoEmbarque.codigo)?.numero}
                                , {pontosEmbarque.find(ponto => ponto.codigo === escola.pontoEmbarque.codigo)?.bairro}</td>
                            <td className='linhas-tabela' style={{width: '9%'}}>{pontosEmbarque.find(ponto => ponto.codigo === escola.pontoEmbarque.codigo)?.cep
                                .replace(/^(\d{5})(\d{3})$/, '$1-$2')}</td>
                            <td className='linhas-tabela'>
                                {escola.tipo === 'I'
                                    ? 'Educação Infantil'
                                    : escola.tipo === 'F'
                                        ? 'Ensino Fundamental'
                                        : escola.tipo === 'A'
                                            ? 'Educação Infantil e Ensino Fundamental'
                                            : escola.tipo === 'M'
                                                ? 'Ensino Médio'
                                                : ''}
                            </td>
                            <td className='linhas-tabela'>{escola.email}</td>
                            <td className='linhas-tabela' style={{width: '13%'}}>{escola.telefone}</td>
                            <td className='linhas-tabela' style={{width: '10%'}}>
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
                <ModalExcluir
                    mostrarModalExcluir={mostrarModalExcluir}
                    mensagemExcluir="Deseja realmente excluir esta escola?"
                    onConfirmar={confirmarExclusao}
                    onCancelar={() => setMostrarModalExcluir(false)}
                />
            </table>
        </Container>
    );
}
