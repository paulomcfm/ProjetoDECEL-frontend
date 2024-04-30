import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from "../recursos/estado";
const urlBase = 'http://localhost:8080/monitor';
// const urlBase = 'https://projetodecel-backend.onrender.com/monitor';


export const buscarMonitores = createAsyncThunk('monitores/buscar', async (filtro) => {
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
                listaMonitores: dados.listaMonitores,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaMonitores: [],
                mensagem: 'Ocorreu um erro ao recuperar monitores da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaMonitores: [],
            mensagem: 'Ocorreu um erro ao recuperar monitores da base de dados:' + erro.message
        }
    }
});

export const adicionarMonitor = createAsyncThunk('monitor/adicionar', async (monitor) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(monitor)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar monitor:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            monitor
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar monitor.',
            monitor
        }
    }
});

export const atualizarMonitor = createAsyncThunk('monitor/atualizar', async (monitor) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(monitor)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar monitor:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            monitor
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar monitor.',
            monitor
        }
    }
});

export const removerMonitor = createAsyncThunk('monitor/remover', async (monitorId) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": monitorId })
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover monitor:' + erro.message,
            monitorId
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            monitorId
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover monitor.',
            monitorId
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    monitores: []
};

const monitorSlice = createSlice({
    name: 'monitores',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarMonitores.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando clientes...";
        }).addCase(buscarMonitores.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.monitores = action.payload.listaMonitores;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarMonitores.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarMonitor.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.monitores.push(action.payload.motorista);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarMonitor.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando motorista...";
        }).addCase(adicionarMonitor.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar motorista: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarMonitor.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.monitores.findIndex(motorista => motorista.cnh === action.payload.motorista.cnh);
            state.monitores[indice] = action.payload.motorista;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarMonitor.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando motorista...";
        }).addCase(atualizarMonitor.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar motorista: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerMonitor.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.monitores = state.monitores.filter(motorista => motorista.id !== action.payload.motoristaId);
        }).addCase(removerMonitor.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo motorista...";
        }).addCase(removerMonitor.rejected, (state, action) => {
            state.mensagem = "Erro ao remover motorista: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default monitorSlice.reducer;