import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import MapaPagina from './telasSaida/MapaPagina.jsx';
import TelaLogin from './telasCadastro/telaLogin.jsx';
import TelaCadastroUser from './telasCadastro/telaCadastroUser.jsx';
import Esqueci from './telasCadastro/telaEsqueci.jsx';
import TelaMenu from './telasCadastro/TelaMenu.jsx';
import TelaCodigo from './telasCadastro/telaCodigo.jsx';
import RotaProtegida from './rotaProtegida.js';
import MensagemPermissaoNegada from './mensagemPermissaonegada.jsx';

function App() {
  const autenticado = useSelector(state => state.usuario.autenticado);
  const isAdmin = useSelector(state => state.usuario.nivelAcesso === "admin");
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<TelaLogin />} />
        <Route path='/esqueci-senha' element={<Esqueci />} />
        <Route path='/codigo' element={<TelaCodigo />} />
        
        <Route path='/pontos-embarque' element={autenticado ? <TelaCadastroPontoEmbarque /> : <RotaProtegida><TelaCadastroPontoEmbarque /></RotaProtegida>} />
        <Route path='/motorista' element={autenticado ? <TelaMotorista /> : <RotaProtegida><TelaMotorista /></RotaProtegida>} />
        <Route path='/cadastro-user' element={isAdmin ? <TelaCadastroUser /> : <MensagemPermissaoNegada/>} />
        <Route path='/alunos' element={autenticado ? <TelaCadastroAluno /> : <RotaProtegida><TelaCadastroAluno /></RotaProtegida>} />
        <Route path='/responsaveis' element={autenticado ? <TelaCadastroResponsavel /> : <RotaProtegida><TelaCadastroResponsavel /></RotaProtegida>} />
        <Route path='/escolas' element={autenticado ? <TelaCadastroEscola /> : <RotaProtegida><TelaCadastroEscola /></RotaProtegida>} />
        <Route path='/menu' element={autenticado ? <TelaMenu /> : <RotaProtegida><TelaMenu /></RotaProtegida>} />
        <Route path='/inscricao-aluno' element={autenticado ? <TelaCadastroInscricao /> : <RotaProtegida><TelaCadastroInscricao /></RotaProtegida>} />
        <Route path='/definir-rota' element={autenticado ? <TelaDefinirRotas /> : <RotaProtegida><TelaDefinirRotas /></RotaProtegida>} />
        <Route path='/alocar-aluno' element={autenticado ? <TelaAlocarAluno /> : <RotaProtegida><TelaAlocarAluno /></RotaProtegida>} />
        <Route path='/registrar-manutencao' element={autenticado ? <TelaRegistrarManutencao /> : <RotaProtegida><TelaRegistrarManutencao /></RotaProtegida>} />
        <Route path='/mapa-rota' element={autenticado ? <MapaPagina /> : <RotaProtegida><MapaPagina /></RotaProtegida>} />
        
        <Route path='*' element={<Tela404 />} />
      </Routes>
    </div>
  );
}

export default App;
