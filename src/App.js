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
            <Route path='/esqueci-senha' element={<Esqueci/>} />

            <Route path='/pontos-embarque' element={autenticado ? <TelaCadastroPontoEmbarque/> : <RotaProtegida><TelaCadastroPontoEmbarque /></RotaProtegida>} />
            <Route path='/motorista' element={autenticado ? <TelaMotorista/> : <RotaProtegida><TelaMotorista /></RotaProtegida>} />
            <Route path='/cadastro-user' element={autenticado ? <TelaCadastroUser/> : <RotaProtegida><TelaCadastroUser /></RotaProtegida>} />
            <Route path='/alunos' element={autenticado ? <TelaCadastroAluno/> : <RotaProtegida><TelaCadastroAluno /></RotaProtegida>} />
            <Route path='/responsaveis' element={autenticado ? <TelaCadastroResponsavel/> : <RotaProtegida><TelaCadastroResponsavel /></RotaProtegida>} />
            <Route path='/escolas' element={autenticado ? <TelaCadastroEscola/> : <RotaProtegida><TelaCadastroEscola /></RotaProtegida>} />
            <Route path='/menu' element={autenticado ? <TelaMenu/> : <RotaProtegida><TelaMenu /></RotaProtegida>} />
            <Route path='/inscricao-aluno' element={autenticado ? <TelaCadastroInscricao/> : <RotaProtegida><TelaCadastroInscricao /></RotaProtegida>} />
            <Route path='/definir-rota' element={autenticado ? <TelaDefinirRotas/> : <RotaProtegida><TelaDefinirRotas /></RotaProtegida>} />
            <Route path='/alocar-aluno' element={autenticado ? <TelaAlocarAluno/> : <RotaProtegida><TelaAlocarAluno /></RotaProtegida>} />
            <Route path='/registrar-manutencao' element={autenticado ? <TelaRegistrarManutencao/> : <RotaProtegida><TelaRegistrarManutencao /></RotaProtegida>} />
            <Route path='/mapa-rota' element={autenticado ? <MapaPagina/> : <RotaProtegida><MapaPagina /></RotaProtegida>} />
            
            <Route path='*' element={<Tela404 />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;