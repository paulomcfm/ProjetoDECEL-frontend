import TelaCadastroEscola from './telasCadastro/telaCadastroEscola.jsx';
import TelaCadastroMonitor from './telasCadastro/TelaCadastroMonitor.jsx';
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
import RelatorioRotasDiferentes from './telasSaida/RelatorioRotasDiferentes.jsx';
import RelatorioRotasDesatualizadas from './telasSaida/RelatorioRotasDesatualizadas.jsx';
import Esqueci from './telasCadastro/telaEsqueci.jsx';
import RelatorioAlunos from './telasSaida/RelatorioAlunos.jsx';
import RelatorioAlunosNaoInscritos from './telasSaida/RelatorioNaoInscritos.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaMenu from './telasCadastro/TelaMenu.jsx'
import store from './redux/store.js';
import { Provider } from 'react-redux';
import './recursos/App.css';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/pontos-embarque' element={<TelaCadastroPontoEmbarque />} />
            <Route path='/motorista' element={<TelaMotorista />} />
            <Route path='/' element={<TelaLogin />} />
            <Route path='/esqueci-minha-senha' element={<Esqueci />} />
            <Route path='/cadastro-user' element={<TelaCadastroUser />} />
            <Route path='/alunos' element={<TelaCadastroAluno />} />
            <Route path='/responsaveis' element={<TelaCadastroResponsavel />} />
            <Route path='/escolas' element={<TelaCadastroEscola />} />
            <Route path='/menu' element={<TelaMenu />} />
            <Route path='/inscricao-aluno' element={<TelaCadastroInscricao />} />
            <Route path='/definir-rota' element={<TelaDefinirRotas />} />
            <Route path='/alocar-aluno' element={<TelaAlocarAluno />} />
            <Route path='/registrar-manutencao' element={<TelaRegistrarManutencao />} />
            <Route path='/mapa-rota' element={<MapaPagina />} />
            <Route path='/relatorios/alunos' element={<RelatorioAlunos />} />
            <Route path='/monitor' element={< TelaCadastroMonitor/>} />
            <Route path='/relatorios/rotas-diferentes' element={<RelatorioRotasDiferentes />} />
            <Route path='/relatorios/rotas-desatualizadas' element={<RelatorioRotasDesatualizadas />} />
            <Route path='relatorios/alunos-nao-inscritos' element={<RelatorioAlunosNaoInscritos />} />
            
            <Route path='*' element={<Tela404 />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;