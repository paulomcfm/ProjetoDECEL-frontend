import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'http://localhost:8080/escola';

export const buscarEscolas = createAsyncThunk('escola/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaEscolas: dados.listaEscolas,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaEscolas: [],
                mensagem: 'Ocorreu um erro ao recuperar as escolas da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaEscolas: [],
            mensagem: 'Ocorreu um erro ao recuperar as escolas da base de dados:' + erro.message
        }
    }
});

export const buscarEscolaPorPonto  = createAsyncThunk('escola/buscar', async (ponto) => {
    try {
        const resposta = await fetch(urlBase+"/buscar-por-ponto/"+ponto, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaEscolas: dados.listaEscolas,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaEscolas: [],
                mensagem: 'Ocorreu um erro ao recuperar as escolas da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaEscolas: [],
            mensagem: 'Ocorreu um erro ao recuperar as escolas da base de dados:' + erro.message
        }
    }
});

export const adicionarEscola = createAsyncThunk('escola/adicionar', async (escola) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(escola)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a escola:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            escola
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a escola.',
            escola
        }
    }
});

export const atualizarEscola = createAsyncThunk('escola/atualizar', async (escola) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(escola)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a escola:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            escola
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a escola.',
            escola
        }
    }
});

export const removerEscola = createAsyncThunk('escola/remover', async (escola) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(escola)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a escola:' + erro.message,
            escola
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            escola
        }
    }
    else {
        const erro = await resposta.json();
        return {
            status: false,
            mensagem: erro.mensagem,
            escola
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    escolas: []
};

const escolaSlice = createSlice({
    name: 'escola',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarEscolas.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando escolas...";
        }).addCase(buscarEscolas.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.escolas = action.payload.listaEscolas;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarEscolas.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarEscola.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.escolas.push(action.payload.escola);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarEscola.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando escola...";
        }).addCase(adicionarEscola.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar a escola: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarEscola.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.escolas.findIndex(escola => escola.codigo === action.payload.escola.codigo);
            state.escolas[indice] = action.payload.escola;
            state.mensagem = action.payload.mensagem;

        }).addCase(atualizarEscola.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando escola...";
        }).addCase(atualizarEscola.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar a escola: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerEscola.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.escolas = state.escolas.filter(escola => escola.codigo !== action.payload.escola.codigo);
        }).addCase(removerEscola.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo escola...";
        }).addCase(removerEscola.rejected, (state, action) => {
            state.mensagem = "Erro ao remover a escola: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default escolaSlice.reducer;