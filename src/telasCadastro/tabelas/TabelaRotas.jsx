import { useState,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { buscarRotas } from "../../redux/rotaReducer";
import { Row, Col, Container, Table } from "react-bootstrap";

export default function TabelaRotas(props){
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(buscarRotas());
    }, [dispatch]);

    const { estado, mensagem, rotas } = useSelector(state => state.rota);

    
    const [pesquisar, setPesquisar] = useState(''); 

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

    }

    function listarRotas(rota){
        // console.log("Rota: "+JSON.stringify(rota))
        return (
            <tr key={rota.codigo}>
                <td>{rota.nome}</td>
                <td>{rota.km}</td>
                <td>{defPeriodo(rota.periodo)}</td>
                <td>{rota.tempoInicio}</td>
                <td>{rota.volta}</td>
                <td>{rota.veiculo[0].vei_placa}</td>
                <td>{rota.monitor[0].mon_nome}</td>
                <td>{motoristasNomes(rota.motoristas)}</td>
                <td style={{ display: 'flex', gap: '5px' }}>
                      <button type="button" className="btn btn-danger" onClick={()=>{remover()}}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                          </svg>
                      </button>
                      <button type="button" className="btn btn-warning" onClick={()=>{
                          props.setForm({
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
                          props.setTela(false)
                      }}>    
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                          </svg>
                      </button>
                      <button type="button" style={{border:'none',backgroundColor:'#C7C8CC',borderRadius:'4px',width:'43px'}}>
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
            <Row>
                <Col>
                    <button type="button" className="btn btn-primary" onClick={()=>{props.setTela(false)}}>Cadastrar Rota</button>{' '}
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <input type="text" id="nome" className="form-control mb-3 mx-auto"  placeholder="Pesquisar Rota..." style={{width:'400px'}} name='nome'  onChange={manipularMudancas}/>
                </Col>
            </Row>
            <Table>
                <thead>
                    <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Km</th>
                    <th scope="col">Periodo</th>
                    <th scope="col">Ida</th>
                    <th scope="col">Volta</th>
                    <th scope="col">Veiculo</th>
                    <th scope="col">Monitor</th>
                    <th scope="col">Motoristas</th>
                    <th scope="col" style={{width:'125px'}}>Ações</th>
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
            </Table>
        </Container>
    )
}
