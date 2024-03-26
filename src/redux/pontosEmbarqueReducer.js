import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'http://localhost:4000/pontos-embarque';

export const buscarPontosEmbarque = createAsyncThunk('pontos-embarque/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaPontosEmbarque: dados.listaPontosEmbarque,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaPontosEmbarque: [],
                mensagem: 'Ocorreu um erro ao recuperar os pontos de embarque da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaPontosEmbarque: [],
            mensagem: 'Ocorreu um erro ao recuperar os pontos de embarque da base de dados:' + erro.message
        }
    }
});

export const adicionarPontoEmbarque = createAsyncThunk('pontos-embarque/adicionar', async (pontoEmbarque) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pontoEmbarque)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o ponto de embarque:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            pontoEmbarque
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o ponto de embarque.',
            pontoEmbarque
        }
    }
});

export const atualizarPontoEmbarque = createAsyncThunk('pontos-embarque/atualizar', async (pontoEmbarque) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pontoEmbarque)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o ponto de embarque:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            pontoEmbarque
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o ponto de embarque.',
            pontoEmbarque
        }
    }
});

export const removerPontoEmbarque = createAsyncThunk('pontos-embarque/remover', async (pontoEmbarque) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pontoEmbarque)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o ponto de embarque:' + erro.message,
            pontoEmbarque
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            pontoEmbarque
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o ponto de embarque.',
            pontoEmbarque
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    pontosEmbarque: []
};

const pontoEmbarqueSlice = createSlice({
    name: 'pontoEmbarque',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarPontosEmbarque.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando pontos de embarque...";
        }).addCase(buscarPontosEmbarque.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.pontosEmbarque = action.payload.listaPontosEmbarque;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarPontosEmbarque.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarPontoEmbarque.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.pontosEmbarque.push(action.payload.pontoEmbarque);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarPontoEmbarque.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando pontos de embarque...";
        }).addCase(adicionarPontoEmbarque.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar ponto de embarque: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarPontoEmbarque.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.pontosEmbarque.findIndex(pontoEmbarque => pontoEmbarque.codigo === action.payload.pontoEmbarque.codigo);
            state.pontosEmbarque[indice] = action.payload.pontoEmbarque;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarPontoEmbarque.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando pontos de embarque...";
        }).addCase(atualizarPontoEmbarque.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar ponto de embarque: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerPontoEmbarque.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.pontosEmbarque = state.pontosEmbarque.filter(pontoEmbarque => pontoEmbarque.codigo !== action.payload.pontoEmbarque.codigo);
        }).addCase(removerPontoEmbarque.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo pontos de embarque...";
        }).addCase(removerPontoEmbarque.rejected, (state, action) => {
            state.mensagem = "Erro ao remover ponto de embarque: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default pontoEmbarqueSlice.reducer;