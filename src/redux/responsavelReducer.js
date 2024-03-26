import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'https://projetodecel-backend.onrender.com/responsavel';

export const buscarResponsaveis = createAsyncThunk('responsavel/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaResponsaveis: dados.listaResponsaveis,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaResponsaveis: [],
                mensagem: 'Ocorreu um erro ao recuperar os responsáveis da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaResponsaveis: [],
            mensagem: 'Ocorreu um erro ao recuperar os responsáveis da base de dados:' + erro.message
        }
    }
});

export const adicionarResponsavel = createAsyncThunk('responsavel/adicionar', async (responsavel) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(responsavel)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o responsável:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            responsavel
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o responsável.',
            responsavel
        }
    }
});

export const atualizarResponsavel = createAsyncThunk('responsavel/atualizar', async (responsavel) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(responsavel)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o responsável:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            responsavel
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o responsável.',
            responsavel
        }
    }
});

export const removerResponsavel = createAsyncThunk('responsavel/remover', async (responsavel) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(responsavel)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o responsável:' + erro.message,
            responsavel
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            responsavel
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o responsável.',
            responsavel
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    responsaveis: []
};

const responsavelSlice = createSlice({
    name: 'responsavel',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarResponsaveis.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando responsáveis...";
        }).addCase(buscarResponsaveis.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.responsaveis = action.payload.listaResponsaveis;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarResponsaveis.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarResponsavel.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.responsaveis.push(action.payload.responsavel);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarResponsavel.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando responsável...";
        }).addCase(adicionarResponsavel.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar o responsável: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarResponsavel.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.responsaveis.findIndex(responsavel => responsavel.codigo === action.payload.responsavel.codigo);
            state.responsaveis[indice] = action.payload.responsavel;
            state.mensagem = action.payload.mensagem;

        }).addCase(atualizarResponsavel.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando responsável...";
        }).addCase(atualizarResponsavel.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar o responsável: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerResponsavel.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.responsaveis = state.responsaveis.filter(responsavel => responsavel.codigo !== action.payload.responsavel.codigo);
        }).addCase(removerResponsavel.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo responsável...";
        }).addCase(removerResponsavel.rejected, (state, action) => {
            state.mensagem = "Erro ao remover o responsável: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default responsavelSlice.reducer;