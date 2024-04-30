import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from "../recursos/estado";
const urlBase = 'http://localhost:8080/motorista';

export const buscarMotoristas = createAsyncThunk('motoristas/buscar', async (filtro) => {
    try {
        let resposta;
        if(filtro === undefined){
             resposta = await fetch(urlBase, {
                method: 'GET'   
            })
        }else{
            let url = `${urlBase}/${filtro}`;
            resposta = await fetch(url, {
                method: 'GET'   
            })
        }
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaMotoristas: dados.listaMotoristas,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaMotoristas: [],
                mensagem: 'Ocorreu um erro ao recuperar motoristas da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaMotoristas: [],
            mensagem: 'Ocorreu um erro ao recuperar motoristas da base de dados:' + erro.message
        }
    }
});

export const adicionarMotorista = createAsyncThunk('motorista/adicionar', async (motorista) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(motorista)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar motorista:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            motorista
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar motorista.',
            motorista
        }
    }
});

export const atualizarMotorista = createAsyncThunk('motorista/atualizar', async (motorista) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(motorista)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar motorista:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            motorista
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar motorista.',
            motorista
        }
    }
});

export const removerMotorista = createAsyncThunk('motorista/remover', async (motoristaId) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": motoristaId })
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover motorista:' + erro.message,
            motoristaId
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            motoristaId
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover motorista.',
            motoristaId
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    motoristas: []
};

const motoristaSlice = createSlice({
    name: 'motoristas',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarMotoristas.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando clientes...";
        }).addCase(buscarMotoristas.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.motoristas = action.payload.listaMotoristas;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarMotoristas.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarMotorista.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.motoristas.push(action.payload.motorista);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarMotorista.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando motorista...";
        }).addCase(adicionarMotorista.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar motorista: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarMotorista.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.motoristas.findIndex(motorista => motorista.cnh === action.payload.motorista.cnh);
            state.motoristas[indice] = action.payload.motorista;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarMotorista.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando motorista...";
        }).addCase(atualizarMotorista.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar motorista: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerMotorista.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.motoristas = state.motoristas.filter(motorista => motorista.id !== action.payload.motoristaId);
        }).addCase(removerMotorista.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo motorista...";
        }).addCase(removerMotorista.rejected, (state, action) => {
            state.mensagem = "Erro ao remover motorista: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default motoristaSlice.reducer;