import { Table, Modal, Button, Row, Col, Container, FormControl } from 'react-bootstrap'
import { buscarMonitores, removerMonitor } from '../../redux/monitorReducer.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export default function TabelaMonitor(props) {
    const [monitorE, setMonitorE] = useState(null)
    const { estado, mensagem, monitores } = useSelector(state => state.monitor)
    const [mensagemF, setMensagemF] = useState("")
    const [pesquisar, setPesquisar] = useState('');
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
    const [exibirM, setExibirM] = useState(0)
    const [esconder, setEsconder] = useState(true)
    const dispatch = useDispatch();

    async function alerta(valor) {
        setEsconder(true)
        setMostrarConfirmacao(false);
        if (valor === true) {
            const resposta = await dispatch(removerMonitor(monitorE));
            if (resposta.payload.status) {
                setMensagemF(resposta.payload.mensagem);
                setExibirM(1);
            } else {
                setExibirM(2);
                setMensagemF(resposta.payload.mensagem);
            }
            setTimeout(() => {
                setExibirM(0);
            }, 3000);
        }
    }

    function remover(monitor) {
        console.log(monitor)
        setMonitorE(monitor.codigo)
        setMostrarConfirmacao(true)
        setEsconder(false)
    }

    useEffect(() => {
        dispatch(buscarMonitores());
        console.log(monitores)
    }, [dispatch]);

    function manipularMudancas(evento) {
        const target = evento.target
        setPesquisar(target.value)
        console.log(pesquisar)
    }

    return (
        <Container className="d-flex justify-content-center flex-column align-items-center" style={{ marginTop: '40px' }}>
            {exibirM === 1 ?
                <div className="alert alert-success" role="alert">
                    {mensagemF}
                </div>
                : exibirM === 2 ?
                    <div className="alert alert-danger" role="alert">
                        {mensagemF}
                    </div>
                    : null
            }
            <Modal show={mostrarConfirmacao} onHide={esconder}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deseja realmente excluir o monitor?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => alerta(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => alerta(true)}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row style={{ marginBottom: '40px' }}>
                <Col>
                    <button type="button" className="btn btn-primary" onClick={() => { props.setTela(false) }}>Cadastrar Monitor</button>{' '}
                </Col>
            </Row>
            <br />
            <FormControl style={{
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #ced4da',
                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                width: '750px',
            }} type="text" placeholder="Pesquisar" className="mr-sm-2" name='nome' onChange={manipularMudancas} />
            <table className='tabela'>
                <thead className='head-tabela'>
                    <tr>
                        <th className='linhas-titulo-tabela' scope="col">Nome</th>
                        <th className='linhas-titulo-tabela' scope="col">CPF</th>
                        <th className='linhas-titulo-tabela' scope="col">Celular</th>
                        <th className='linhas-titulo-tabela' scope="col" style={{ width: '125px' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {monitores.map(monitor => (

                        pesquisar === '' || monitor.nome.toLowerCase().includes(pesquisar.toLowerCase()) ?
                            <tr key={monitor.codigo}>
                                <td className='linhas-tabela'>{monitor.nome}</td>
                                <td className='linhas-tabela'>{monitor.cpf}</td>
                                <td className='linhas-tabela'>{monitor.celular}</td>
                                <td className='linhas-tabela' style={{ display: 'flex', gap: '5px' }}>
                                    <button type="button" className="btn btn-danger" onClick={() => { remover(monitor) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                        </svg>
                                    </button>
                                    <button type="button" className="btn btn-warning" onClick={() => {
                                        props.setMonitor({
                                            codigo: monitor.codigo,
                                            nome: monitor.nome,
                                            cpf: monitor.cpf,
                                            celular: monitor.celular
                                        })
                                        props.setModo('edicao')
                                        props.setTela(false)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                            :
                            null
                    ))}
                </tbody>
            </table>
        </Container>
    )
}
