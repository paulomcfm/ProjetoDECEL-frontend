import { configureStore } from '@reduxjs/toolkit';
import escolaSlice from './escolaReducer.js';
import responsavelSlice from './responsavelReducer.js';
import alunoSlice from './alunoReducer.js';

const store = configureStore({
    reducer: {
        escola: escolaSlice,
        responsavel: responsavelSlice,
        aluno: alunoSlice
    }
});

export default store;