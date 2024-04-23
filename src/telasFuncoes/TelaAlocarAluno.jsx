// import { useState, useEffect } from 'react';
// import React from 'react';
// import { Container, Form, Table, OverlayTrigger, Popover, Card, Button, Col, Row, Dropdown } from 'react-bootstrap';
// import '../templates/style.css';
// import Pagina from "../templates/Pagina";
// import { GrContactInfo } from "react-icons/gr";



// export default function TelaAlocarAluno(props) {
//     const [rotaSelecionada, setRotaSelecionada] = useState(null);
//     const [rotaEstaSelecionada, setRotaEstaSelecionada] = useState(false);
//     const [inscricoesSelecionadas, setInscricoesSelecionadas] = useState([]);
//     const [termoBusca, setTermoBusca] = useState('');
//     const [inscricoesFiltradas, setInscricoesFiltradas] = useState([]);


//     var rota1 = {
//         nome: 'Rota 1',
//         km: '10',
//         periodo: 'Matutino',
//         tempoInicio: '08:00',
//         tempoFinal: '12:00',
//         motorista: {
//             nome: 'João da Silva',
//             cnh: '123456789',
//             celular: '9999-9999'
//         },
//         monitor: {
//             nome: 'Maria Oliveira',
//             cnh: '987654321',
//             celular: '8888-8888'
//         },
//         veiculo: {
//             placa: 'ABC-1234',
//             renavam: '123456789',
//             modelo: 'Fiat Uno',
//             capacidade: '5',
//             tipo: 'Micro-ônibus'
//         },
//         pontosDeEmbarque: [
//             { rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
//             { rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
//         ],
//         inscricoes: [
//             { nome: 'Aluno 1', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
//             { nome: 'Aluno 2', rg: '2345678', dataNasc: '2001-02-02', celular: '2222-2222', observacoes: 'Observações do Aluno 2' }
//         ]
//     };

//     var rota2 = {
//         nome: 'Rota 2',
//         km: '15',
//         periodo: 'Vespertino',
//         tempoInicio: '13:00',
//         tempoFinal: '17:00',
//         motorista: {
//             nome: 'Pedro Oliveira',
//             cnh: '987654321',
//             celular: '8888-8888'
//         },
//         monitor: {
//             nome: 'Ana da Silva',
//             cnh: '123456789',
//             celular: '9999-9999'
//         },
//         veiculo: {
//             placa: 'XYZ-9876',
//             renavam: '987654321',
//             modelo: 'Volkswagen Gol',
//             capacidade: '4',
//             tipo: 'Van'
//         },
//         pontosDeEmbarque: [
//             { rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
//             { rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
//         ],
//         inscricoes: [
//             { nome: 'Aluno 3', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
//             { nome: 'Aluno 4', rg: '2345678', dataNasc: '2001-02-02', celular: '2222-2222', observacoes: 'Observações do Aluno 2' }
//         ]
//     };

//     var rota3 = {
//         nome: 'Rota 3',
//         km: '20',
//         periodo: 'Noturno',
//         tempoInicio: '18:00',
//         tempoFinal: '22:00',
//         motorista: {
//             nome: 'Carlos Santos',
//             cnh: '456789123',
//             celular: '7777-7777'
//         },
//         monitor: {
//             nome: 'Fernanda Lima',
//             cnh: '789123456',
//             celular: '6666-6666'
//         },
//         veiculo: {
//             placa: 'DEF-5678',
//             renavam: '456789123',
//             modelo: 'Chevrolet Onix',
//             capacidade: '4',
//             tipo: 'Carro'
//         },
//         pontosDeEmbarque: [
//             { rua: 'Rua A', bairro: 'Bairro A', numero: '123', cep: '12345-678' },
//             { rua: 'Rua B', bairro: 'Bairro B', numero: '456', cep: '23456-789' }
//         ],
//         inscricoes: [
//             { nome: 'Aluno 5', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
//             { nome: 'Aluno 6', rg: '2345678', dataNasc: '2001-02-02', celular: '2222-2222', observacoes: 'Observações do Aluno 2' }
//         ]
//     };

//     var inscricoes = [
//         { nome: 'Aluno 51', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
//         { nome: 'Aluno 52', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
//         { nome: 'Aluno 53', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
//         { nome: 'Aluno 54', rg: '1234567', dataNasc: '2000-01-01', celular: '1111-1111', observacoes: 'Observações do Aluno 1' },
//         { nome: 'Aluno 60', rg: '2345678', dataNasc: '2001-02-02', celular: '2222-2222', observacoes: 'Observações do Aluno 2' }
//     ]

//     var listaRotas = [rota1, rota2, rota3];

//     const handleBuscarAluno = () => {
//         const resultados = inscricoes.filter(inscricao =>
//             inscricao.nome.toLowerCase().includes(termoBusca.toLowerCase())
//         );
//         setInscricoesFiltradas(resultados);
//     };

//     useEffect(() => {
//         if (termoBusca.trim() === '') {
//             setInscricoesFiltradas([]);
//         } else {
//             const inscricoesNaoAlocadas = inscricoes.filter(inscricao =>
//                 inscricao.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
//                 !inscricoesSelecionadas.find(a => a.nome === inscricao.nome)
//             );
//             setInscricoesFiltradas(inscricoesNaoAlocadas);
//         }
//     }, [termoBusca, inscricoesSelecionadas]);


//     const handleSelecionarRota = (rota) => {
//         setRotaSelecionada(rota);
//         setRotaEstaSelecionada(true);
//         setInscricoesSelecionadas(rota.inscricoes || []);
//         setTermoBusca('');
//     };

//     const handleRemoverInscricao = (index) => {
//         const inscricoesAtualizadas = [...rotaSelecionada.inscricoes];
//         inscricoesAtualizadas.splice(index, 1);
//         setRotaSelecionada({
//             ...rotaSelecionada,
//             inscricoes: inscricoesAtualizadas
//         });
//         setInscricoesSelecionadas(inscricoesAtualizadas);
//     };
//     const handleAdicionarInscricao = (index) => {
//         const inscricao = inscricoesFiltradas[index];
//         const inscricoesAtualizadas = [...rotaSelecionada.inscricoes, inscricao];
//         setRotaSelecionada({
//             ...rotaSelecionada,
//             inscricoes: inscricoesAtualizadas
//         });
//         setInscricoesSelecionadas(inscricoesAtualizadas);
//     };

//     return (
//         <Pagina>
//             <Container className="mt-4 mb-4 text-center">
//                 <h2>Alocar Aluno</h2>
//                 <Form.Group className="mb-3" controlId="selecionarRota">
//                     <Form.Label>Selecione a rota:</Form.Label>
//                     <Form.Select onChange={(e) => handleSelecionarRota(listaRotas.find(rota => rota.nome === e.target.value))}>
//                         <option value="">Selecione...</option>
//                         {listaRotas.map((rota, index) => (
//                             <option key={index} value={rota.nome}>{rota.nome}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//                 {rotaEstaSelecionada && rotaSelecionada && (
//                     <>
//                         <Table striped bordered className="mt-4">
//                             <thead>
//                                 <tr>
//                                     <th>Nome da Rota</th>
//                                     <th>Motorista</th>
//                                     <th>Monitor</th>
//                                     <th>Placa do Veículo</th>
//                                     <th>Pontos de Embarque</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {rotaSelecionada && (
//                                     <tr>
//                                         <td className="text-center align-middle">{rotaSelecionada.nome}</td>
//                                         <td className="text-center align-middle">{rotaSelecionada.motorista.nome}</td>
//                                         <td className="text-center align-middle">{rotaSelecionada.monitor.nome}</td>
//                                         <td className="text-center align-middle">{rotaSelecionada.veiculo.placa}</td>
//                                         <td>
//                                             <ul className="list-unstyled mb-0">
//                                                 {rotaSelecionada.pontosDeEmbarque.map((ponto, index) => (
//                                                     <li key={index}>
//                                                         {ponto.rua}, {ponto.numero}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </Table>

//                         {inscricoesSelecionadas.map((inscricao, index) => (
//                             <div key={index} className="d-flex justify-content-center align-items-center">
//                                 <OverlayTrigger
//                                     trigger="click"
//                                     key="bottom"
//                                     placement="bottom"
//                                     overlay={
//                                         <Popover id={`popover-positioned-bottom`}>
//                                             <Popover.Header as="h3">{inscricao.nome}</Popover.Header>
//                                             <Popover.Body>
//                                                 <p>RG: {inscricao.rg}</p>
//                                                 <p>Data de Nascimento: {inscricao.dataNasc}</p>
//                                                 <p>Celular: {inscricao.celular}</p>
//                                                 <p>Observações: {inscricao.observacoes}</p>
//                                             </Popover.Body>
//                                         </Popover>
//                                     }
//                                 >
//                                     <Button variant="light" className="me-2 mb-2 mt-4 w-50">
//                                         <GrContactInfo style={{ marginRight: '15px' }} /> {`${inscricao.nome} - RG: ${inscricao.rg}`}
//                                     </Button>
//                                 </OverlayTrigger>
//                                 <Button variant="danger" className="mb-2 mt-4" onClick={() => handleRemoverInscricao(index)}>
//                                     Remover
//                                 </Button>
//                             </div>
//                         ))}

//                         <Form.Label className="mt-4">Alunos:</Form.Label>
//                         <div className="d-flex">
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Busque um aluno"
//                                 value={termoBusca}
//                                 onChange={(e) => setTermoBusca(e.target.value)}
//                             />
//                         </div>
//                         <div className="mt-2">
//                             {inscricoesFiltradas.map((inscricao, index) => (
//                                 <div key={index} className="d-flex justify-content-center align-items-center">
//                                     <OverlayTrigger
//                                         trigger="click"
//                                         key="bottom"
//                                         placement="bottom"
//                                         overlay={
//                                             <Popover id={`popover-positioned-bottom`}>
//                                                 <Popover.Header as="h3">{inscricao.nome}</Popover.Header>
//                                                 <Popover.Body>
//                                                     <p>RG: {inscricao.rg}</p>
//                                                     <p>Data de Nascimento: {inscricao.dataNasc}</p>
//                                                     <p>Celular: {inscricao.celular}</p>
//                                                     <p>Observações: {inscricao.observacoes}</p>
//                                                 </Popover.Body>
//                                             </Popover>
//                                         }
//                                     >
//                                         <Button variant="light" className="me-2 mb-2 mt-4 w-50">
//                                             <GrContactInfo style={{ marginRight: '15px' }} /> {`${inscricao.nome} - RG: ${inscricao.rg}`}
//                                         </Button>
//                                     </OverlayTrigger>
//                                     <Button
//                                         variant="primary"
//                                         className="mb-2 mt-4"
//                                         onClick={() => handleAdicionarInscricao(index)}
//                                     >
//                                         Adicionar
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                         <Button
//                             variant="primary"
//                             className="mb-2 mt-4"
//                             onClick={() => { }}
//                         >
//                             Confirmar Alocação
//                         </Button>
//                     </>
//                 )}

//             </Container>
//         </Pagina>
//     );
// }