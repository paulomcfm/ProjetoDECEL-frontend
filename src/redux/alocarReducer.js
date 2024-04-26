import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'http://localhost:8080/alocar-alunos';

export const atualizarInscricoes = createAsyncThunk('alocar-alunos/atualizar-inscricoes', async (inscricoes) => {
    const resposta = await fetch(urlBase + '/atualizar-inscricoes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inscricoes)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a inscrição:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            inscricoes
        }
    }
    else {
        const dados = await resposta.json();
        return {
            status: false,
            mensagem: dados.mensagem,
            inscricoes
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    inscricoes: []
};

const alocarSlice = createSlice({
    name: 'alocar',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(atualizarInscricoes.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const { ano, alunos: { codigo } } = action.payload.alocar;
            const indice = state.inscricoes.findIndex(alocar => alocar.ano === ano && alocar.alunos.codigo === codigo);
            state.inscricoes[indice] = action.payload.alocar;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarInscricoes.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando inscrição...";
        }).addCase(atualizarInscricoes.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar a inscrição: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default alocarSlice.reducer;