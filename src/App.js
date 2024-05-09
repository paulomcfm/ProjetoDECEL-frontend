import TelaCadastroEscola from './telasCadastro/telaCadastroEscola.jsx';
import TelaCadastroResponsavel from './telasCadastro/telaCadastroResponsavel.jsx';
import TelaCadastroAluno from './telasCadastro/telaCadastroAluno.jsx';
import TelaCadastroPontoEmbarque from './telasCadastro/telaCadastroPontoEmbarque.jsx';
import TelaMotorista from './telasCadastro/telaMotorista.jsx';
import Tela404 from './telasCadastro/Tela404.jsx';
import TelaCadastroInscricao from './telasFuncoes/telaCadastroInscricao.jsx';
import TelaDefinirRotas from './telasFuncoes/TelaDefinirRotas.jsx';
import TelaAlocarAluno from './telasFuncoes/TelaAlocarAluno.jsx';
import TelaRegistrarManutencao from './telasFuncoes/TelaRegistrarManutencao.jsx';
import MapaPagina from './telasSaida/MapaPagina.jsx'
import TelaLogin from './telasCadastro/telaLogin.jsx';
import TelaCadastroUser from './telasCadastro/telaCadastroUser.jsx';
import Esqueci from './telasCadastro/telaEsqueci.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaMenu from './telasCadastro/TelaMenu.jsx'
import store from './redux/store.js';
import { Provider } from 'react-redux';
import RotaProtegida from './RotaProtegida';
import { useSelector } from 'react-redux';

function App() {
  const autenticado = useSelector(state => state.usuario.autenticado);
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<TelaLogin />} />

            <Route path='/pontos-embarque' element={
              <RotaProtegida>
                <TelaCadastroPontoEmbarque />
              </RotaProtegida>
              } autenticado={autenticado}
            />
            <Route path='/motorista' element={<RotaProtegida> <TelaMotorista /> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/esqueci-minha-senha' element={<Esqueci />} />
            <Route path='/cadastro-user' element={<RotaProtegida> <TelaCadastroUser /> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/alunos' element={<RotaProtegida> <TelaCadastroAluno/> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/responsaveis' element={<RotaProtegida> <TelaCadastroResponsavel/> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/escolas' element={<RotaProtegida> <TelaCadastroEscola/> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/menu'element={
              <RotaProtegida>
                <TelaMenu />
              </RotaProtegida>
            } autenticado={autenticado}/>
            <Route path='/inscricao-aluno' element={<RotaProtegida> <TelaCadastroInscricao/> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/definir-rota' element={<RotaProtegida> <TelaDefinirRotas/> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/alocar-aluno' element={<RotaProtegida> <TelaAlocarAluno/> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/registrar-manutencao' element={<RotaProtegida> <TelaRegistrarManutencao/> </RotaProtegida>} autenticado={autenticado}/>
            <Route path='/mapa-rota' element={<RotaProtegida> <MapaPagina/> </RotaProtegida>} autenticado={autenticado}/>
            
            <Route path='*' element={<Tela404 />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;