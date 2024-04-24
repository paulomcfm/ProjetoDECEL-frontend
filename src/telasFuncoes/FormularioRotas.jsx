import React, { useRef } from 'react';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pagina from '../templates/Pagina';
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux';
import { buscarPontosEmbarque } from '../redux/pontosEmbarqueReducer';
import { adicionarRotas,buscarRotas } from '../redux/rotaReducer';
import {buscarMotoristas} from '../redux/motoristaReducer'

import { useEffect } from 'react';

import '../templates/style.css';
import '../styles/rota.css'

export default function FormularioRotas(props) {

  const [form,setForm] = useState(props.form)
  
  const {estadoR,mensagemR,rotas} = useSelector(state => state.rota)
  const { estado, mensagem, pontosEmbarque } = useSelector(state => state.pontoEmbarque);
  const { estadoM, mensagemM, motoristas } = useSelector(state => state.motorista);
  const dispatch =  useDispatch()
  
  
  const [placas,setPlacas] = useState([
    {
      "vei_codigo":1,
      "vei_placa":"ABC123",
      "vei_modelo":"Ônibus"
    },
    {
      "vei_codigo":2,
      "vei_placa":"XYZ789",
      "vei_modelo":"Micro"
    },
    {
      "vei_codigo":3,
      "vei_placa":"DEF456",
      "vei_modelo":"Micro"
    },
    {
      "vei_codigo":4,
      "vei_placa":"GHI789",
      "vei_modelo":"Ônibus"
    }
  ])

  
  


  

  const [selecionadoM, setSelecionadoM] = useState([]);

  useEffect(()=>{
    
    const listaSel = form.motoristas.map(motorista => ({
      value: motorista.id,
      label: motorista.nome
    }))
    setSelecionadoM(listaSel)


  },[])


  const [motoristasM,setMotoristasM] = useState([])

  useEffect(() => {
    dispatch(buscarMotoristas());
  }, [dispatch]);
  
    useEffect(() => {
      
      if (motoristas.length > 0) {
        let listaFiltrada = motoristas.map(moto => ({
          moto_id: moto.id,
          moto_nome: moto.nome 
        }))
        setMotoristasM(listaFiltrada);
        const json = {...form}
        json.motoristas = listaFiltrada
        setForm(json)
      }
    }, [motoristas]);

  
  
  const [selecionado, setSelecionado] = useState([]);

  useEffect(() => {
    const atualizarListaSel = () => {
      const novaListaSel = form.pontos.map(ponto => ({
        codigo: ponto.codigo,
        rua: ponto.rua,
        numero: ponto.numero,
        cep: ponto.cep
      }));
      setSelecionado(novaListaSel);
      const json = {...form}
      json.pontos = novaListaSel
      setForm(json)
    };


    atualizarListaSel();
  }, []);

  

  const [pesquisa,setPesquisa] = new useState('')
  const [pesquisaSelecionado,setPesquisaSelecionado] = new useState('')
  const [pontosDeParada,setPontosDeParada] = useState([])
  
  useEffect(() => {
    dispatch(buscarPontosEmbarque());
  }, [dispatch]);
  
    useEffect(() => {
      if (pontosEmbarque.length > 0) {
        const listaFiltrada = pontosEmbarque.filter(ponto => !selecionado.some(sel => sel.codigo === ponto.codigo));
        setPontosDeParada(listaFiltrada);
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


    const options = motoristasM.map(motorista => ({
      label: motorista.moto_nome,
      value: motorista.moto_id
    }));

    const handleChange = selectedOptions => {
      setSelecionadoM(selectedOptions);
    };

    function manipularMudancas(event){
        const input = event.target
        setForm({...form,[input.name]:input.value})
    }


    

    async function submissao(){
      const nomes = Object.keys(form)
      let teste = true
      for(let i=0;i<nomes.length-2;i++){
        if(i!=2){
          const valor = form[nomes[i]]
          let elem = document.getElementById(nomes[i])
          if(valor != ''){
            elem.classList.remove('input-invalido')
            elem.classList.add('input-valido')
          }else{
            teste = false
            elem.classList.remove('input-valido')
            elem.classList.add('input-invalido')
          }
        }
      }

      if(selecionadoM.length==0){
        teste = false
        let elem = document.getElementById(nomes[7])
        elem.classList.remove('input-valido')
        elem.classList.add('input-invalido')
      }else{
        let elem = document.getElementById(nomes[7])
        elem.classList.remove('input-invalido')
        elem.classList.add('input-valido')
      }

      if(selecionado.length==0){
        teste = false
        let elem = document.getElementById('selecionados')
        elem.classList.remove('input-valido')
        elem.classList.add('input-invalido')
      }else{
        let elem = document.getElementById('selecionados')
        elem.classList.remove('input-invalido')
        elem.classList.add('input-valido')
      }
      
      
      
      if(teste){
        // gravar
        if(props.modoEdicao == 'gravar'){
          console.log('euuuu')
          const json = {...form}
          //  Passando os vetores de selecionado para os seus respectivos atributos
          let vetorM = []
          for(let i=0;i<selecionadoM.length;i++){
              vetorM.push(selecionadoM[i].value)
          }
          json.motoristas = JSON.stringify(vetorM)
          let vetor = []
          for(let i=0;i<selecionado.length;i++){
            vetor.push(selecionado[i].codigo)
          }
          json.pontos = JSON.stringify(vetor)
          setForm(json)
          dispatch(adicionarRotas(json))
        }
        // alterar
        else{
          const json = {...form}
          //  Passando os vetores de selecionado para os seus respectivos atributos
          let vetorM = []
          for(let i=0;i<selecionadoM.length;i++){
              vetorM.push(selecionadoM[i].value)
          }
          json.motoristas = JSON.stringify(vetorM)
          let vetor = []
          for(let i=0;i<selecionado.length;i++){
            vetor.push(selecionado[i].codigo)
          }
          json.pontos = JSON.stringify(vetor)
          setForm(json)

          console.log(JSON.stringify(json))
        }
      }
    }

    return (
      <>
                <div className="container mt-5" >
                <div>
                <Row className='justify-content-center'>
                    <Col md className='text-center'>
                      <h4>Nome da Rota(*):</h4>
                      <input type="text" id="nome" className="form-control mb-3 mx-auto"  placeholder="Rota Escola A" style={{width:'400px'}} name='nome' value={form.nome}  onChange={manipularMudancas}/>
                    </Col>
                    <Col md className='text-center'>
                      <h4>Quilometragem da Rota(*):</h4>
                      <input type="text" id="km" className="form-control mb-3 mx-auto"  placeholder="Escreva a Quilometragem" style={{width:'400px'}} name='km' value={form.km} onChange={manipularMudancas}/>
                    </Col>
                </Row>

                </div>
                <Row>
                  <Col md>
                    <h4 className="mb-3">Placa do Veículo(*):</h4>
                    <select id="veiculo" className="form-select mb-3" name='veiculo' value={form.veiculo} onChange={manipularMudancas}>
                        {
                          placas.map(veiculo =>{
                            return(<option key={veiculo.vei_codigo} value={veiculo.vei_codigo}>{veiculo.vei_placa} ({veiculo.vei_modelo})</option>)
                          })
                        }
                    </select>
                  </Col>

                  <Col md>
                    <h4 className="mb-3">Motorista(*):</h4>
                    <div className="mb-3">
                    <Select
                          className="mb-3 mx-auto" 
                          options={options}
                          isMulti
                          value={selecionadoM}
                          onChange={handleChange}
                          id='motoristas'
                          placeholder="selecionar motorista"
                    />
                    </div>
                  </Col>
                  
                  <Col md>
                    <h4 className="mb-3">Monitor(*):</h4>
                    <div className="mb-3">
                        <select id="monitor" className="form-select" name='monitor' value={form.monitor} onChange={manipularMudancas}>
                            <option value="1">Valdemar</option>
                            <option value="2">Antonio</option>
                            <option value="3">Joao</option>
                            <option value="4">Maria</option>
                        </select>
                    </div>
                  </Col>

                </Row>

                <br />
                <Row className="g-2">

                  <Col md>
                    <h4 className="mb-3">Período:</h4>
                    <div className="mb-3" >
                        <div className="form-check form-check-inline">
                        <input style={{border:'solid 1px #A6A6A6'}} className="form-check-input" type="radio" name="periodo" id='periodo'  value="M" checked={form.periodo==='M' ? true : false} onChange={manipularMudancas}/>
                            <label className="form-check-label" htmlFor="manha">Manhã</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input style={{border:'solid 1px #A6A6A6'}} className="form-check-input" type="radio" name="periodo" id='periodo' value="T" checked={form.periodo==='T' ? true : false} onChange={manipularMudancas}/>
                            <label className="form-check-label" htmlFor="tarde">Tarde</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input style={{border:'solid 1px #A6A6A6'}} className="form-check-input" type="radio" name="periodo" id='periodo' value="N" checked={form.periodo==='N' ? true : false} onChange={manipularMudancas}/>
                            <label className="form-check-label" htmlFor="noite">Noite</label>
                        </div>
                    </div>
                  </Col>

                  <Col md>
                  <h4 className='mb-3'>Horários(*):</h4>
                      <label htmlFor="inicio">Início:</label>{' '}
                      <input style={{ border: 'solid 1px #8a8282a1', width: '80px', textAlign: 'center', borderRadius: '3px' }} className='mb-3 mx-auto' type="time" name="ida" id="ida" value={form.ida} onChange={manipularMudancas} />
                      {' '}
                      <label htmlFor="volta">Volta:</label>{' '}
                      <input style={{border:'solid 1px #8a8282a1',width:'80px',textAlign:'center',borderRadius:'3px'}} className='mb-3 mx-auto' type="time" name="volta" id="volta" value={form.volta} onChange={manipularMudancas}/>
                      
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
                <h4 className="mb-3">Pontos Selecionados(*): </h4>
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
                {props.modoEdicao === 'gravar'?<button type="button" className="btn btn-primary" onClick={()=>{submissao()}}>Cadastrar</button>:<button type="button" className="btn btn-warning" onClick={()=>{submissao()}}>Alterar</button>}{' '}
                <button type="button" className="btn btn-danger" onClick={()=>{
                  props.setForm(props.formVazio)
                  props.setModoEdicao('gravar')
                  props.setTela(true)
                  }}> Voltar</button>
            </div>
        </>
    );
}