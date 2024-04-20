import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'http://localhost:8080/rota';

export const buscarRotas = createAsyncThunk('rota/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaRotas: dados.listaRotas,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaRotas: [],
                mensagem: 'Ocorreu um erro ao recuperar as rotas da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaRotas: [],
            mensagem: 'Ocorreu um erro ao recuperar as rotas da base de dados:' + erro.message
        }
    }
});

export const adicionarRota = createAsyncThunk('rota/adicionar', async (rota) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rota)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a rota:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            rota
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a rota.',
            rota
        }
    }
});

export const atualizarRota = createAsyncThunk('rota/atualizar', async (rota) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rota)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a rota:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            rota
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a rota.',
            rota
        }
    }
});

export const removerRota = createAsyncThunk('rota/remover', async (rota) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rota)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a rota:' + erro.message,
            rota
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            rota
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a rota.',
            rota
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    rotas: []
};

const rotaSlice = createSlice({
    name: 'rota',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarRotas.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando rotas...";
        }).addCase(buscarRotas.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.rotas = action.payload.listaRotas;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarRotas.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarRota.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.rotas.push(action.payload.rota);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarRota.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando rota...";
        }).addCase(adicionarRota.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar a rota: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarRota.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.rotas.findIndex(rota => rota.codigo === action.payload.rota.codigo);
            state.rotas[indice] = action.payload.rota;
            state.mensagem = action.payload.mensagem;

        }).addCase(atualizarRota.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando rota...";
        }).addCase(atualizarRota.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar a rota: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerRota.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.rotas = state.rotas.filter(rota => rota.codigo !== action.payload.rota.codigo);
        }).addCase(removerRota.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo rota...";
        }).addCase(removerRota.rejected, (state, action) => {
            state.mensagem = "Erro ao remover a rota: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default rotaSlice.reducer;