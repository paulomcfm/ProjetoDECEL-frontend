import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'https://projetodecel-backend-production-85a1.up.railway.app/definir-rota';

export const buscarRotas = createAsyncThunk('rotas/buscar', async (filtro) => {
    try {
        let url = urlBase;
        if(filtro!=undefined) {
            url = url + '/' + filtro;
        }
        const resposta = await fetch(url, { method: 'GET' });
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

export const buscarRotasInscricoes = createAsyncThunk('inscricoes-rotas/buscar', async () => {
    try {
        let urlBase = 'http://localhost:8080/inscricoes-rota'
        
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

export const adicionarRotas = createAsyncThunk('rotas/adicionar', async (rota) => {
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


export const atualizarRota = createAsyncThunk('rotas/atualizar', async ({ rota, aceito }) => {
    console.log("aceito: "+aceito)
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'rota': JSON.stringify(rota), 'aceito': aceito })
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a rota:' + erro.message
        }
    });
    const dados = await resposta.json();
    if (resposta.ok) {
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            rota
        }
    }
    else {
        return {
            status: false,
            mensagem: dados.mensagem,
            rota
        }
    }
});


export const removerRota = createAsyncThunk('rotas/remover', async (rota) => {
    const urlB = urlBase + '/' + rota
    const resposta = await fetch(urlB, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a rota:' + erro,
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
            mensagem: 'Não é possível deletar está rota',
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
        }).addCase(buscarRotasInscricoes.pending,(state,action)=>{
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando rotas...";
        }).addCase(buscarRotasInscricoes.fulfilled,(state,action)=>{
            if(action.payload.status){
                state.estado = ESTADO.OCIOSO
            }else{
                state.estado = ESTADO.ERRO
            }
            state.rotas = action.payload.listaRotas
            state.mensagem = action.payload.mensagem
        }).addCase(buscarRotasInscricoes.rejected,(state,action)=>{
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        })
        .addCase(adicionarRotas.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            // state.rotas.push(action.payload.rota);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarRotas.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando rota...";
        }).addCase(adicionarRotas.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar a rota: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarRota.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarRota.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando rota...";
        }).addCase(atualizarRota.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar a rota: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerRota.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            if (action.payload.status === true)
                state.rotas = state.rotas.filter(rota => rota.codigo != action.payload.rota)
            else
                state.estado = ESTADO.ERRO
            state.mensagem = action.payload.mensagem;
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