import { useState,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { buscarRotas } from "../../redux/rotaReducer";
import { Row, Col, Container, Table,Modal,Button } from "react-bootstrap";
import { removerRota,buscarRotasInscricoes } from "../../redux/rotaReducer";
import '../../templates/style.css'

export default function TabelaRotas(props){
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(buscarRotas());
    }, [dispatch]);
    
    const { estado, mensagem, rotas } = useSelector(state => state.rota);
    const [pesquisar, setPesquisar] = useState(''); 
    const [mostrarConfirmacao,setMostrarConfirmacao] = useState(false)
    const [esconder,setEsconder] = useState(true)
    const [rotaE,setRotaE] = useState(0)
    const [mensagemF,setMensagemF] = useState('')
    const [exibirM,setExibirM] = useState(0)
    
    async function alerta(valor){
        setEsconder(true)
        setMostrarConfirmacao(false)
        if(valor === true){
            const resposta  = await dispatch(removerRota(rotaE))
            if(resposta.payload.status){
                setMensagemF(resposta.payload.mensagem)
                setExibirM(1)
            }else{
                setExibirM(2)
                setMensagemF(resposta.payload.mensagem)
            }
            setTimeout(()=>{
                setExibirM(0)
            },3000)
        }
    }

    function manipularMudancas(evento){
        const input = evento.target;
        const valorPesquisa = input.value;
        setPesquisar(valorPesquisa); 
    }

    function defPeriodo(periodo){
        if(periodo === 'M')
            return 'Manhã'
        else
        if(periodo === 'T')
            return 'Tarde'
        else
            return 'Noite'
    }

    function motoristasNomes(vetor){
        let texto = ''

        for(let i=0;i<vetor.length;i++){
            texto+=vetor[i].nome
            if(i+1<vetor.length)
                texto+=','
        }
        
        return texto
    }
    
    function remover(rota){
        setRotaE(rota)
        setMostrarConfirmacao(true)
        setEsconder(false)
    }

    const API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
    const API_KEY = 'AIzaSyCKNlqqhmlCYU7bLjeku8uWsDfxOxDM5R8';

    async function resgatarCoordenadas(endereco) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${API_KEY}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.status === 'OK') {
                const resultado = data.results[0];
                const coordenadas = resultado.geometry.location;
                const latitude = coordenadas.lat;
                const longitude = coordenadas.lng;
    
                return  {
                            location:{
                                lat: latitude,
                                lng: longitude
                            }
                        };
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    async function listaPontos(rota){
        const enderecos = rota.pontos
        const origem = []
        const destino = []
        const listaIntermed = []
        const lista = []
        for(let i=0;i<enderecos.length;i++){
            const address = enderecos[i].rua +" "+ enderecos[i].numero + " " + enderecos[i].bairro
            const retorno = await resgatarCoordenadas(address) 
            if(retorno != null){
                lista.push(retorno)
                console.log("lista:" +lista)
            }
        }
        
        
        if(lista.length>0){
            origem.push(lista[0])
            destino.push(lista[lista.length-1])
            for(let i=1;i<lista.length-1;i++){
                listaIntermed.push(lista[i])
            }
        }

        console.log("origem "+JSON.stringify(origem)," destino "+JSON.stringify(destino)," pontosIntermediarios"+JSON.stringify(listaIntermed))
        
        return {
            origem:origem,
            destino: destino,
            listaIntermed:listaIntermed
        }
    }

    function listarRotas(rota){
        // console.log("Rota: "+JSON.stringify(rota))
        return (
            <tr key={rota.codigo}>
                <td className='linhas-tabela'>{rota.nome}</td>
                <td className='linhas-tabela'>{rota.km}</td>
                <td className='linhas-tabela'>{defPeriodo(rota.periodo)}</td>
                <td className='linhas-tabela'>{rota.tempoInicio}</td>
                <td className='linhas-tabela'>{rota.volta}</td>
                <td className='linhas-tabela'>{rota.veiculo[0].vei_placa}</td>
                <td className='linhas-tabela'>{rota.monitor[0].mon_nome}</td>
                <td className='linhas-tabela'>{motoristasNomes(rota.motoristas)}</td>
                <td className='linhas-tabela'>{rota.status==true? 'Ativo':'Desativado'}</td>
                <td className='linhas-tabela' style={{ display: 'flex', gap: '5px' }}>
                      <button type="button" className="btn btn-danger" onClick={()=>{remover(rota.codigo)}}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                          </svg>
                      </button>
                      <button type="button" className="btn btn-warning" onClick={()=>{
                          props.setForm({
                            codigo:rota.codigo,
                            nome:rota.nome,
                            km:rota.km,
                            periodo:rota.periodo,
                            ida:rota.tempoInicio,
                            volta:rota.volta,
                            veiculo:rota.veiculo[0].vei_codigo,
                            monitor:rota.monitor[0].mon_codigo,
                            motoristas:rota.motoristas,
                            pontos:rota.pontos
                          })
                          props.setModoEdicao('edicao')
                          props.setTela(2)
                      }}>    
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                          </svg>
                      </button>
                      <button type="button" style={{border:'none',backgroundColor:'#C7C8CC',borderRadius:'4px',width:'43px'}} onClick={async ()=>{
                        props.setEnderecos(await listaPontos(rota))
                        props.setTela(3)
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-map" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.8V1.11l-4 .8v12.98z"/>
                        </svg>
                      </button>
                    </td>
            </tr>
        )
    }



    return (
        <Container className="d-flex justify-content-center flex-column align-items-center" style={{marginTop:'40px'}}>
            { 
                exibirM===1?
                <div class="alert alert-success" role="alert">
                    {mensagemF}
                </div>
                :
                exibirM==2?
                <div class="alert alert-danger" role="alert">
                    {mensagemF}
                </div>
                :
                null
              }
            <Modal show={mostrarConfirmacao} onHide={esconder}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirmar Exclusão</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Deseja realmente excluir a rota?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={()=>{
                                    alerta(false)
                                }}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={()=>{
                                    alerta(true)
                                }}>
                                    Confirmar
                                </Button>
                            </Modal.Footer>
            </Modal>
            <Row style={{marginBottom:'40px'}}>
                <Col>
                    <button type="button" className="btn btn-primary" onClick={()=>{props.setTela(2)}}>Cadastrar Rota</button>{' '}
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <input type="text" id="nome" className="form-control mb-3 mx-auto"  placeholder="Pesquisar Rota..." style={{width:'400px'}} name='nome'  onChange={manipularMudancas}/>
                </Col>
            </Row>
            <table className='tabela'>
                <thead className='head-tabela'>
                    <tr>
                    <th className='linhas-titulo-tabela' >Nome</th>
                    <th className='linhas-titulo-tabela' >Km</th>
                    <th className='linhas-titulo-tabela' >Periodo</th>
                    <th className='linhas-titulo-tabela' >Ida</th>
                    <th className='linhas-titulo-tabela' >Volta</th>
                    <th className='linhas-titulo-tabela' >Veiculo</th>
                    <th className='linhas-titulo-tabela' >Monitor</th>
                    <th className='linhas-titulo-tabela' >Motoristas</th>
                    <th className='linhas-titulo-tabela' >Status</th>
                    <th className='linhas-titulo-tabela'  style={{width:'125px'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rotas.map(rota =>{
                            let nomeR = rota.nome.toLowerCase();
                            let pesL = pesquisar.toLowerCase();
                            if (pesquisar === '' || nomeR.includes(pesL)) {
                                return listarRotas(rota);
                            }
                            return null;
                        })
                    }
                </tbody>
            </table>
        </Container>
    )
}
