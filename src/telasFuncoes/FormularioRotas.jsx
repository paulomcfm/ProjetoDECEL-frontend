import React from 'react';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pagina from '../templates/Pagina';
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux';
import { buscarPontosEmbarque } from '../redux/pontosEmbarqueReducer';
import { useEffect } from 'react';
import '../templates/style.css';

export default function FormularioRotas(props) {

  const [form,setForm] = useState(props.form)

  const { estado, mensagem, pontosEmbarque } = useSelector(state => state.pontoEmbarque);
  const dispatch =  useDispatch()

  
  const [placas,setPlacas] = useState([
    {
      "placa":"ABC123",
      "tipo":"Ônibus"
    },
    {
      "placa":"XYZ789",
      "tipo":"Micro"
    },
    {
      "placa":"DEF456",
      "tipo":"Micro"
    },
    {
      "placa":"GHI789",
      "tipo":"Ônibus"
    }
  ])

  const motoristas = [
    {nome:"Valdemar"},
    {nome:"Antonio"},
    {nome:"Joao"},
    {nome:"Maria"}
  ]
  
  
    const [selecionado,setSelecionado] = useState([])
    const [pesquisa,setPesquisa] = new useState('')
    const [pesquisaSelecionado,setPesquisaSelecionado] = new useState('')
    const [pontosDeParada,setPontosDeParada] = useState([])

    useEffect(() => {
      dispatch(buscarPontosEmbarque());
    }, [dispatch]);
  
    useEffect(() => {
      if (pontosEmbarque.length > 0) {
        setPontosDeParada(pontosEmbarque);
      }
    }, [pontosEmbarque]);
    
    
    function pesquisarPontos(e){
      const componente = e.target
      setPesquisa(componente.value)
    }
    
    function pesquisarPontosSelecionados(e){
      const componente = e.target
      setPesquisaSelecionado(componente.value)
    }
    
    
    function addPonto(ponto){
        setPontosDeParada(pontosDeParada.filter(pontoF => pontoF.codigo!==ponto.codigo))
        const lista = selecionado
        lista.push(ponto)
        setSelecionado(lista)
      }

    function subirPos(sel){
      // usado para criar um copia do array 'selecionado'
      let novaListaSelecionados = [...selecionado]
      let i=0;
      while(i<novaListaSelecionados.length && novaListaSelecionados[i].codigo!==sel.codigo)
      i++;
    if(i>0){
      let aux = novaListaSelecionados[i];
      novaListaSelecionados[i] = novaListaSelecionados[i - 1];
      novaListaSelecionados[i - 1] = aux;
      setSelecionado(novaListaSelecionados);
    }
  }

  function descerPos(sel){
    // usado para criar um copia do array 'selecionado'
    let novaListaSelecionados = [...selecionado]
    let i=0;
    while(i<novaListaSelecionados.length && novaListaSelecionados[i].codigo!==sel.codigo)
    i++;
  if(i<novaListaSelecionados.length-1){
    let aux = novaListaSelecionados[i];
    novaListaSelecionados[i] = novaListaSelecionados[i + 1];
    novaListaSelecionados[i + 1] = aux;
    setSelecionado(novaListaSelecionados);
  }
}

  function retirarSelecionado(sel){
    setSelecionado(selecionado.filter(selecionadoF => selecionadoF.codigo!==sel.codigo))
    const lista = pontosDeParada
    lista.push(sel)
    setPontosDeParada(lista)
  }
  function listarPontos(ponto){
    return (
      <div key={ponto.codigo}>
          <label style={{height:"30px"}}>
            <button type="button" style={{border:'none',background:'none'}} onClick={()=>{addPonto(ponto)}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
            </button>
              {' '}{ponto.rua}{'('}{ponto.numero}{')'}, {ponto.cep}
          </label>
      </div>
    );
  }
  function listaPontosSelecionados(sel){
    
    return (
      <div key={sel.codigo}>
          <label style={{height:"30px"}}>
              <button type="button" style={{border:'none',background:'none'}} onClick={()=>{subirPos(sel)}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
                  <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
              </svg>
              </button>
              <button type="button" style={{border:'none',background:'none'}} onClick={()=>{descerPos(sel)}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-sort-down-alt" viewBox="0 0 16 16">
                <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5"/>
              </svg>
              </button>
              <button type="button" style={{border:'none',background:'none'}} onClick={()=>{retirarSelecionado(sel)}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
              </svg>
              </button>
              {' '}{sel.rua}{'('}{sel.numero}{')'}, {sel.cep}
          </label>
        </div>
      )
    }

    const [selecionadoM, setSelecionadoM] = useState([]);

    const options = motoristas.map(motorista => ({
      label: motorista.nome,
      value: motorista.nome
    }));

    const handleChange = selectedOptions => {
      setSelecionadoM(selectedOptions);
    };
    return (
      <>
                <div className="container mt-5" >
                <div>
                <Row className='justify-content-center'>
                    <Col md className='text-center'>
                      <h4>Nome da Rota:</h4>
                      <input type="text" id="searchInput" className="form-control mb-3 mx-auto"  placeholder="Rota Escola A" style={{width:'400px'}}/>
                    </Col>
                </Row>

                </div>
                <Row>
                  <Col md>
                    <h4 className="mb-3">Placa do Veículo:</h4>
                    <select id="placaVeiculo" className="form-select mb-3">
                        {
                          placas.map(placa =>{
                            return(<option key={placa.placa} value={placa.placa}>{placa.placa} ({placa.tipo})</option>)
                          })
                        }
                    </select>
                  </Col>

                  <Col md>
                    <h4 className="mb-3">Motorista</h4>
                    <div className="mb-3">
                    <Select
                          options={options}
                          isMulti
                          value={selecionadoM}
                          onChange={handleChange}
                          placeholder="selecionar motorista"
                    />
                    </div>
                  </Col>
                  
                  <Col md>
                    <h4 className="mb-3">Monitor</h4>
                    <div className="mb-3">
                        <select id="motorista" className="form-select" >
                            <option value="Valdemar">Valdemar</option>
                            <option value="Antonio">Antonio</option>
                            <option value="Joao">Joao</option>
                            <option value="Maria">Maria</option>
                        </select>
                    </div>
                  </Col>

                </Row>

                <br />
                <Row className="g-2">

                  <Col md>
                    <h4 className="mb-3">Período:</h4>
                    <div className="mb-3">
                        <div className="form-check form-check-inline">
                            <input style={{border:'solid 1px #A6A6A6'}} className="form-check-input" type="radio" name="periodo" id="manha" defaultChecked/>
                            <label className="form-check-label" htmlFor="manha">Manhã</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input style={{border:'solid 1px #A6A6A6'}} className="form-check-input" type="radio" name="periodo" id="tarde" />
                            <label className="form-check-label" htmlFor="tarde">Tarde</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input style={{border:'solid 1px #A6A6A6'}} className="form-check-input" type="radio" name="periodo" id="noite" />
                            <label className="form-check-label" htmlFor="noite">Noite</label>
                        </div>
                    </div>
                  </Col>

                  <Col md>
                  <h4 className='mb-3'>Horários:</h4>
                      <label htmlFor="inicio">Início:</label>{' '}
                      <input style={{border:'solid 1px black',width:'80px',textAlign:'center',borderRadius:'3px'}} type="time" name="inicio" id="" />{' '}
                      <label htmlFor="volta">Volta:</label>{' '}
                      <input style={{border:'solid 1px black',width:'80px',textAlign:'center',borderRadius:'3px'}} type="time" name="volta" id="" />
                  </Col>
                </Row>

                <br/><br />
                <h4 className="mb-3">Pontos de Parada:</h4>
                <input type="text" id="searchInput" className="form-control mb-3" onChange={pesquisarPontos} placeholder="Pesquisar pontos de parada..." />
                <div id="pontosParadaContainer" className="bg-light p-3" style={{ overflowY: 'auto', maxHeight: '200px', border: '1px solid #ccc', borderRadius: '5px' }}>
                {
                  pontosDeParada.length>0?
                      pontosDeParada.map(ponto => {
                        const pontoNomeLowerCase = ponto.rua.toLowerCase()+'('+ponto.numero.toLowerCase()+') - '+ponto.cep;
                        const compNomeLowerCase = pesquisa.toLowerCase();
                        if(pesquisa === ''){
                            return listarPontos(ponto)
                        }else{
                        if (pontoNomeLowerCase.includes(compNomeLowerCase)) {
                          return listarPontos(ponto)
                        } else {
                            return null;
                        }}
                    })
                    :
                    <p>Sem pontos de parada</p>
                }
                </div>

                <br />
                <h4 className="mb-3">Pontos Selecionados: </h4>
                <input type="text" id="searchSelecionado" className="form-control mb-3"  placeholder="Pesquisar Selecionados..." onChange={pesquisarPontosSelecionados} />
                <div id="selecionados" className="bg-light p-3" style={{ overflowY: 'auto', maxHeight: '200px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    {
                      selecionado.length>0?
                        selecionado.map(sel =>{
                          const selecionadoL = sel.rua.toLowerCase()+'('+sel.numero.toLowerCase()+') - '+sel.cep;
                          const pesquisaL = pesquisaSelecionado.toLowerCase();
                          if(pesquisaL === ''){
                            return listaPontosSelecionados(sel)
                          }
                          else
                          if(selecionadoL.includes(pesquisaL)){
                            return listaPontosSelecionados(sel)
                          }
                          else
                            return null
                          })
                      :
                      <p>Sem pontos selecionados</p>
                    }
                </div>

                <br/><br/><br/>
                <button type="button" className="btn btn-primary" >Cadastrar</button>
            </div>
        </>
    );
}