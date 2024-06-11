import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from "../recursos/estado";
const urlBase = 'http://localhost:8080/monitor';



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

export const removerMonitor = createAsyncThunk('monitor/remover', async (monitorCodigo) => {
    const url = urlBase+"/"+monitorCodigo
    console.log(url)
    const resposta = await fetch(url, {
        method: 'DELETE'
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover monitor:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            monitorCodigo
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover monitor.'
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
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarMonitor.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando monitor...";
        }).addCase(adicionarMonitor.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar monitor: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarMonitor.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarMonitor.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando monitor...";
        }).addCase(atualizarMonitor.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar monitor: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerMonitor.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.monitores = state.monitores.filter(monitor => monitor.codigo !== action.payload.monitorCodigo);
            state.mensagem = action.payload.mensagem;
        }).addCase(removerMonitor.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo monitor...";
        }).addCase(removerMonitor.rejected, (state, action) => {
            state.mensagem = "Erro ao remover monitor: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default monitorSlice.reducer;