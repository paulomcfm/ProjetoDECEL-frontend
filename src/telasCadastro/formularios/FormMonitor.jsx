import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import validarCelular from '../../validacoes/validarCelular';
import InputMask from 'react-input-mask';
import {adicionarMonitor,atualizarMonitor} from '../../redux/monitorReducer.js'
import { useDispatch } from 'react-redux';


export default function FormMonitor(props) {
          const [monitor,setMonitor] = useState(props.monitor)
          const [formValidado,setForm] = useState(false)
          const dispatch = useDispatch();



          function manipularMudancas(e){
            const input = e.target
            setMonitor({...monitor,[input.name]:input.value})
          }

          

          const [mensagemForm,setMensagemForm] = useState('')
          const [exibirMensagem,setExibir] = useState(false)

          async function manipularEnvio(e){
              const form = e.target
              if(validarCelular(monitor.celular)){
                
                if(props.modo === 'gravar'){
                  dispatch(adicionarMonitor(monitor))
                  setMensagemForm('Adicionado com sucesso');
                  setExibir(true)
                  setMonitor(props.monitorVazio)

                  setTimeout(function() {
                    setExibir(false)
                  }, 3000);
                }else{
                  dispatch(atualizarMonitor(monitor))
                  setMensagemForm('Atualizado com sucesso');
                  setExibir(true)
                  setTimeout(function() {
                    setExibir(false)
                  }, 3000);
                }
                  setForm(false)
              }else{
                setForm(true)
              }


              e.stopPropagation()
              e.preventDefault()

          }


          return (
            <>
                <h2 className="text-center">{props.modo === 'gravar'?'Cadastrar Monitor':'Alterar Monitor'}</h2>
                <Form noValidate style={{ marginTop: '100px' }} validated={formValidado} onSubmit={manipularEnvio}>
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                    {/* Input do nome */}
                    <Form.Group>
                            <Form.Label>Nome(*):</Form.Label><br/>
                            <Form.Control type="text" placeholder="" value={monitor.nome} name='nome' onChange={manipularMudancas} required/>
                        <Form.Control.Feedback type="invalid">Informe o nome!</Form.Control.Feedback>
                    </Form.Group>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                    {/* Input da cpf */}
                        <Form.Label>cpf(*):</Form.Label><br/>
                        <InputMask
                            style={{width:'300px'}}
                            className="form-control"
                            mask="999.999.999-99" 
                            maskChar="_"
                            placeholder="XXX.XXX.XXX-XX"
                            id="cpf"
                            name="cpf"
                            value={monitor.cpf}
                            onChange={manipularMudancas}
                            required
                            disabled={props.modo !== 'gravar'}
                        />
                    </Col>
                </Row>
                
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                    {/* Input do Telefone */}
                    <label htmlFor="celular">Telefone</label>
                    <InputMask
                        style={{width:'300px'}}
                        className="form-control"
                        mask="(99) 99999-9999"
                        maskChar="_"
                        placeholder="(99) 99999-9999"
                        name="celular"
                        value={monitor.celular}
                        onChange={manipularMudancas}
                        required
                    />
                    </Col>
                </Row>
                <br />
                <Row className="justify-content-center">
                    <Col xs={12} md={1}>
                        { props.modo === 'gravar'?
                        <button type="submit"  className="btn btn-primary">Cadastrar</button>
                        :
                        <button type="submit" className="btn btn-primary">Alterar</button>
                        }
                    </Col>
                    <Col xs={12} md={1}>
                    <button type="button" className="btn btn-danger" onClick={()=>{
                        props.setTela(true)
                        props.setMonitor(props.monitorVazio)
                        }}>Voltar</button>
                    </Col>
                </Row>
                {
                    exibirMensagem === true
                    ?
                    <div className="alert alert-success" role="alert" style={{textAlign:'center',marginTop:'60px',width:'1000px', margin: '0 auto'}}>
                    {mensagemForm}
                    </div>
                    :
                    null
                }

                </Form>
            </>
          );
}
