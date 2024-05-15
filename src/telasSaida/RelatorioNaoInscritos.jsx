import React, { useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { buscarAlunos, atualizarAluno } from '../redux/alunoReducer';
import { buscarInscricoes } from '../redux/inscricaoReducer';
import { useEffect } from 'react';
import { format } from 'date-fns';
import Pagina from '../templates/Pagina';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { TfiWrite } from "react-icons/tfi";
import { IoPersonRemove } from "react-icons/io5";
import '../templates/style.css';
import 'react-toastify/dist/ReactToastify.css';

export default function RelatorioAlunosNaoInscritos(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const { alunos } = useSelector(state => state.aluno);
    const { inscricoes } = useSelector(state => state.inscricao);
    const [mostrarModal, setMostrarModal] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarAlunos());
        dispatch(buscarInscricoes());
    }, [dispatch]);

    const anoAtual = new Date().getFullYear();

    const alunosAtivos = alunos.filter(aluno => aluno.status === 'A'
        && (aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) || aluno.rg.includes(termoBusca)));

    const alunosInscritosOutrosAnos = inscricoes
        .filter(inscricao => inscricao.ano !== anoAtual)
        .map(inscricao => inscricao.aluno.codigo);

    const alunosInscritosAnoAtual = inscricoes
        .filter(inscricao => inscricao.ano === anoAtual)
        .map(inscricao => inscricao.aluno.codigo);

    const alunosNaoInscritosAnoAtual = alunosAtivos.filter(aluno =>
        !alunosInscritosAnoAtual.includes(aluno.codigo)
        && alunosInscritosOutrosAnos.includes(aluno.codigo)
    );

    const navigate = useNavigate();
    function handleInscreverAluno(aluno) {
        navigate('/inscricao-aluno', { state: { alunoSelecionadoRelatorio: aluno } });
    }

    function desabilitarAluno() {
        const alunoModificado = { ...mostrarModal };
        alunoModificado.status = 'I';
        dispatch(atualizarAluno(alunoModificado)).then((retorno) => {
            if (retorno.payload.status) {
                toast.success('Aluno desabilitado com sucesso!', {
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
                toast.error('Aluno não desabilitado! ' + retorno.payload.mensagem, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            }
        });
        setMostrarModal(false);
    }


    return (
        <Pagina>
            <Container style={{ marginTop: '2%' }}>
                <ToastContainer />
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
                <table className='tabela'>
                    <thead className='head-tabela'>
                        <tr>
                            <th className='linhas-titulo-tabela'>Nome</th>
                            <th className='linhas-titulo-tabela'>RG</th>
                            <th className='linhas-titulo-tabela'>Data de Nascimento</th>
                            <th className='linhas-titulo-tabela'>Celular</th>
                            <th className='linhas-titulo-tabela'>Observações</th>
                            <th className='linhas-titulo-tabela'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunosNaoInscritosAnoAtual.map(aluno => (
                            <tr key={aluno.codigo}>
                                <td className='linhas-tabela'>{aluno.nome}</td>
                                <td className='linhas-tabela'>{aluno.rg}</td>
                                <td className='linhas-tabela'>{format(new Date(aluno.dataNasc), 'dd/MM/yyyy')}</td>
                                <td className='linhas-tabela'>{aluno.celular}</td>
                                <td className='linhas-tabela'>{aluno.observacoes}</td>
                                <td className='linhas-tabela' style={{display: 'flex', alignItems: 'center', gap: '2%', justifyContent: 'center'}}>
                                    <Button style={{display: 'flex', alignItems: 'center'}} onClick={() => handleInscreverAluno(aluno)}> <TfiWrite/></Button>
                                    <Button style={{display: 'flex', alignItems: 'center'}} variant='danger' onClick={() => setMostrarModal(aluno)}><IoPersonRemove /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Desabilitar Aluno</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Deseja realmente desabilitar este aluno?</Modal.Body>
                        <Modal.Footer className='d-flex justify-content-center'>
                            <Button variant="danger" onClick={desabilitarAluno}>Sim</Button>
                            <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal>
                </table>
            </Container>
        </Pagina>
    );
}
