
import TelaCadastroEscola from './telasCadastro/telaCadastroEscola.jsx';
import TelaCadastroResponsavel from './telasCadastro/telaCadastroResponsavel.jsx';
import TelaCadastroAluno from './telasCadastro/telaCadastroAluno.jsx';
import TelaCadastroPontoEmbarque from './telasCadastro/telaCadastroPontoEmbarque.jsx';
import Tela404 from './telasCadastro/Tela404.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaMenu from './telasCadastro/TelaMenu.jsx'
import store from './redux/store.js';
import { Provider } from 'react-redux';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/alunos' element={<TelaCadastroAluno />} />
            <Route path='/responsaveis' element={<TelaCadastroResponsavel />} />
            <Route path='/escolas' element={<TelaCadastroEscola />} />
            <Route path='/pontos-embarque' element={<TelaCadastroPontoEmbarque />} />
            <Route path='/' element={<TelaMenu />} />
            <Route path='*' element={<Tela404 />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;


