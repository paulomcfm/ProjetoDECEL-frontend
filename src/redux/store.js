import { configureStore } from '@reduxjs/toolkit';
import escolaSlice from './escolaReducer.js';
import responsavelSlice from './responsavelReducer.js';
import alunoSlice from './alunoReducer.js';
import parentescoSlice from './parentescoReducer.js';

const store = configureStore({
    reducer: {
        escola: escolaSlice,
        responsavel: responsavelSlice,
        aluno: alunoSlice,
        parentesco: parentescoSlice
    }
});

export default store;