import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'http://localhost:8080/veiculo';

export const buscarVeiculos = createAsyncThunk('veiculo/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaVeiculos: dados.listaVeiculos,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaVeiculos: [],
                mensagem: 'Ocorreu um erro ao recuperar os veículos da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaVeiculos: [],
            mensagem: 'Ocorreu um erro ao recuperar os veículos da base de dados:' + erro.message
        }
    }
});


export const adicionarVeiculo = createAsyncThunk('veiculo/adicionar', async (veiculo) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(veiculo)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o veículo:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            veiculo
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o veículo.',
            veiculo
        }
    }
});


export const atualizarVeiculo = createAsyncThunk('veiculo/atualizar', async (veiculo) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(veiculo)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o veículo:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            veiculo
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o veículo.',
            veiculo
        }
    }
});

export const removerVeiculo = createAsyncThunk('veiculo/remover', async (veiculo) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(veiculo)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o veículo:' + erro.message,
            veiculo
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            veiculo
        }
    }
    else {
        const erro = await resposta.json();
        return {
            status: false,
            mensagem: erro.mensagem,
            veiculo
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    veiculos: []
};

const veiculoSlice = createSlice({
    name: 'veiculo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(buscarVeiculos.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando veículos...";
        }).addCase(buscarVeiculos.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.veiculos = action.payload.listaVeiculos;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarVeiculos.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarVeiculo.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.veiculos.push(action.payload.veiculo);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarVeiculo.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando veículo...";
        }).addCase(adicionarVeiculo.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar o veículo: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarVeiculo.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.veiculos.findIndex(veiculo => veiculo.codigo === action.payload.veiculo.codigo);
            state.veiculos[indice] = action.payload.veiculo;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarVeiculo.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando veículo...";
        }).addCase(atualizarVeiculo.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar o veículo: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerVeiculo.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.veiculos = state.veiculos.filter(veiculo => veiculo.codigo !== action.payload.veiculo.codigo);
        }).addCase(removerVeiculo.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo veículo...";
        }).addCase(removerVeiculo.rejected, (state, action) => {
            state.mensagem = "Erro ao remover o veículo: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default veiculoSlice.reducer;