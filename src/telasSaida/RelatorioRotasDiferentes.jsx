import React, { useState, useEffect } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Pagina from '../templates/Pagina';

export default function RelatorioRotasDiferentes(props) {
    const [termoBusca, setTermoBusca] = useState('');
    const { inscricoes } = useSelector(state => state.inscricao);
    const dispatch = useDispatch();
    const { pontosEmbarque } = useSelector(state => state.pontoEmbarque);
    const { escolas } = useSelector(state => state.escola);
    const { alunos } = useSelector(state => state.aluno);
    
    const inscricoesFiltradas = inscricoes ? inscricoes.filter(inscricao =>
        inscricao.aluno.nome.toLowerCase().includes(termoBusca.toLowerCase())
    ) : [];


    return (
        <Pagina>
            <Container>
                <Button
                    type="button"
                    className="d-flex align-items-center mb-4 mt-2 mx-auto"
                    style={{ width: '142px' }}
                    onClick={() => {
                    }}
                >
                    Inscrever Aluno
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
                        placeholder="Buscar inscrições..."
                        value={termoBusca}
                        onChange={e => setTermoBusca(e.target.value)}
                    />
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
                </Table>
            </Container>
        </Pagina>
    );
}
