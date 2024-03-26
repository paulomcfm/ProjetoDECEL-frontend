import { configureStore } from '@reduxjs/toolkit';
import escolaSlice from './escolaReducer.js';
import responsavelSlice from './responsavelReducer.js';
import alunoSlice from './alunoReducer.js';
import parentescoSlice from './parentescoReducer.js';
import pontosEmbarqueReducer from './pontosEmbarqueReducer.js';
import motoristaSlice from './motoristaReducer'

const store = configureStore({
    reducer: {
        escola: escolaSlice,
        responsavel: responsavelSlice,
        aluno: alunoSlice,
        parentesco: parentescoSlice,
        pontoEmbarque: pontosEmbarqueReducer,
        motorista:motoristaSlice
    }
});

export default store;