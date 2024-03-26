import { configureStore } from '@reduxjs/toolkit';
import escolaSlice from './escolaReducer.js';
import responsavelSlice from './responsavelReducer.js';
import alunoSlice from './alunoReducer.js';
import pontosEmbarqueReducer from './pontosEmbarqueReducer.js';

const store = configureStore({
    reducer: {
        escola: escolaSlice,
        responsavel: responsavelSlice,
        aluno: alunoSlice,
        pontoEmbarque: pontosEmbarqueReducer
    }
});

export default store;