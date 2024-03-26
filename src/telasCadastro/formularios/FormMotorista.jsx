import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { adicionarMotorista,atualizarMotorista } from '../../redux/motoristaReducer';
import { useSelector, useDispatch } from 'react-redux';
import validarCNH from '../../validacoes/validarCnh';
import validarTelefone from '../../validacoes/validarTelefone';

export default function FormMotorista(props) {
          const [motorista,setMotorista] = useState(props.motorista)
          const [formValidado,setForm] = useState(false)
          const dispatch = useDispatch();

          const { estado, mensagem, motoristas } = useSelector(state => state.motorista);


          function manipularMudancas(e){
            const input = e.target
            setMotorista({...motorista,[input.name]:input.value})
          }

          

          const [mensagemForm,setMensagemForm] = useState('')
          const [exibirMensagem,setExibir] = useState(false)

          async function manipularEnvio(e){
              const form = e.target
              console.log(validarCNH(motorista.cnh),validarTelefone(motorista.telefone))
              if(validarTelefone(motorista.telefone) && validarCNH(motorista.cnh)){
                
                if(props.modo === 'gravar'){
                  dispatch(adicionarMotorista(motorista))
                  setMensagemForm('Adicionado com sucesso');
                  setExibir(true)
                  setMotorista(props.motoLimpo)

                  setTimeout(function() {
                    setExibir(false)
                  }, 3000);
                }else{
                  dispatch(atualizarMotorista(motorista))
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
            <Form noValidate style={{ marginTop: '100px' }} validated={formValidado} onSubmit={manipularEnvio}>
              <Row className="justify-content-center">
                <Col xs={12} md={6}>
                  {/* Input do nome */}
                  <Form.Group>
                      <FloatingLabel controlId="floatingNome" label="Nome:" className="mb-3">
                        <Form.Control type="text" placeholder="" value={motorista.nome} name='nome' onChange={manipularMudancas} required/>
                      </FloatingLabel>
                    <Form.Control.Feedback type="invalid">Informe o nome!</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col xs={12} md={6}>
                  {/* Input da CNH */}
                  <FloatingLabel controlId="floatingCNH" label="CNH:" className="mb-3">
                    <Form.Control type="text" placeholder="" value={motorista.cnh} name='cnh' onChange={manipularMudancas} required disabled={props.modo !== 'gravar'} />
                  </FloatingLabel>
                </Col>
              </Row>
              
              <Row className="justify-content-center">
                <Col xs={12} md={6}>
                  {/* Input do Telefone */}
                  <FloatingLabel controlId="floatingTelefone" label="Telefone:" className="mb-3">
                    <Form.Control type="tel" placeholder="" value={motorista.telefone} name='telefone' onChange={manipularMudancas} required/>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col xs={12} md={1}>
                    { props.modo === 'gravar'?
                      <button type="submit"  className="btn btn-success">Gravar</button>
                      :
                      <button type="submit" className="btn btn-warning">Alterar</button>
                    }
                </Col>
                <Col xs={12} md={1}>
                <button type="button" className="btn btn-primary" onClick={()=>{props.setTela(true)}}>Voltar</button>
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
          );
}
