  import { Container,FormControl } from 'react-bootstrap';
  import React, { useEffect } from 'react';
  import { useSelector, useDispatch } from 'react-redux';
  import { buscarMotoristas, removerMotorista } from '../../redux/motoristaReducer';



  export default function TabelaMotorista(props){
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(buscarMotoristas());
    }, [dispatch]);

    const { estado, mensagem, motoristas } = useSelector(state => state.motorista);
    

    function remover(key){
      dispatch(removerMotorista(key))
    }
    
    function pesquisa(event){
      const input = event.target
      dispatch(buscarMotoristas(input.value))
    }

      return (
          <Container className="d-flex justify-content-center flex-column align-items-center" style={{marginTop:'40px'}}>
            <button type="button" className="btn btn-primary mb-3" style={{ width: '172px' }} onClick={() => { props.setModo('gravar'); props.setTela(false); props.setMotorista(props.motoLimpo) }}>Cadastrar Motorista</button>
            
            <FormControl style={{
                        borderRadius: '8px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        width: '750px',
                    }} type="text" placeholder="Pesquisar" className="mr-sm-2" onChange={pesquisa}/>
            <table className="table table-bordered" style={{marginTop:'20px'}}>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">CNH</th>
                  <th scope="col">Telefone</th>
                  <th scope="col" style={{width:'125px'}}>Ações</th>
                </tr>
              </thead>
              <tbody>
              {
                motoristas.map((motorista) => (
                  <tr key={motorista.id}>
                      <td>{motorista.nome}</td>
                      <td>{motorista.cnh}</td>
                      <td>{motorista.telefone}</td>
                    <td>
                      <button type="button" className="btn btn-danger" onClick={()=>{remover(motorista.id)}}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                          </svg>
                      </button>
                      {' '}
                      <button type="button" className="btn btn-warning" onClick={()=>{
                          props.setMotorista({
                            nome:motorista.nome,
                            cnh:motorista.cnh,
                            telefone:motorista.telefone
                        })
                          props.setModo('edicao')
                          props.setTela(false)
                      }}>    
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                          </svg>
                      </button>
                    </td>
                  </tr>)
                )
              }
              </tbody>
            </table>
        </Container>
        );
  }