import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './redux/store';
import "bootstrap/dist/css/bootstrap.min.css";

// Obtenha o elemento root
const container = document.getElementById('root');

// Crie a raiz usando React 18
const root = ReactDOM.createRoot(container);

// Renderize a aplicação envolvida pelo Provider do Redux e BrowserRouter
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
