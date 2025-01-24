import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado.js';
const urlBase = 'https://projetodecel-backend-production-85a1.up.railway.app/manutencoes';

export const buscarManutencoes = createAsyncThunk('manutencao/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaManutencoes: dados.listaManutencoes,
                mensagem: ''
            }
        } else {
            return {
                status: false,
                listaManutencoes: [],
                mensagem: 'Ocorreu um erro ao recuperar as manutenções da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaManutencoes: [],
            mensagem: 'Ocorreu um erro ao recuperar as manutenções da base de dados:' + erro.message
        }
    }
});

export const buscarManutencoesRelatorio = createAsyncThunk('manutencao/buscarManutencao', async (data) => {
    try {
        const url = 'http://localhost:8080/manutencoes/relatorios'
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        const dados = await resposta.json();
        console.log(dados.listaManutencoes)
        if (dados.status) {
            return {
                status: true,
                listaManutencoes: dados.listaManutencoes,
                mensagem: ''
            }
        } else {
            return {
                status: false,
                listaManutencoes: [],
                mensagem: 'Ocorreu um erro ao recuperar as manutenções da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaManutencoes: [],
            mensagem: 'Ocorreu um erro ao recuperar as manutenções da base de dados:' + erro.message
        }
    }
});

export const adicionarManutencao = createAsyncThunk('manutencoes/adicionar', async (manutencao, { rejectWithValue }) => {
    try {
        const resposta = await fetch(urlBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(manutencao)
        });

        if (!resposta.ok) {
            const dados = await resposta.json();
            return rejectWithValue(dados);
        }

        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            manutencao
        };
    } catch (erro) {
        return rejectWithValue({
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a manutenção: ' + erro.message,
            manutencao
        });
    }
});

export const atualizarManutencao = createAsyncThunk('manutencoes/atualizar', async (manutencao) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(manutencao)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a manutenção:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            manutencao
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a manutenção.',
            manutencao
        }
    }
});

export const removerManutencao = createAsyncThunk('manutencoes/remover', async (manutencao) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(manutencao)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a manutenção:' + erro.message,
            manutencao
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            manutencao
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a manutenção.',
            manutencao
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    manutencoes: []
};

const manutencaoSlice = createSlice({
    name: 'manutencao',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(buscarManutencoes.pending, (state) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando manutenções...";
        }).addCase(buscarManutencoes.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.manutencoes = action.payload.listaManutencoes;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarManutencoes.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(buscarManutencoesRelatorio.pending, (state) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando manutenções...";
        }).addCase(buscarManutencoesRelatorio.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.manutencoes = action.payload.listaManutencoes;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarManutencoesRelatorio.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarManutencao.pending, (state) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando manutenção...";
        }).addCase(adicionarManutencao.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.manutencoes.push(action.payload.manutencao);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarManutencao.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarManutencao.pending, (state) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando manutenção...";
        }).addCase(atualizarManutencao.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.manutencoes.findIndex(manutencao => manutencao.id === action.payload.manutencao.id);
            if (indice !== -1) {
                state.manutencoes[indice] = action.payload.manutencao;
            }
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarManutencao.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = "Erro ao atualizar a manutenção: " + action.error.message;
        }).addCase(removerManutencao.pending, (state) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo manutenção...";
        }).addCase(removerManutencao.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.manutencoes = state.manutencoes.filter(manutencao => manutencao.id !== action.payload.manutencao.id);
        }).addCase(removerManutencao.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = "Erro ao remover a manutenção: " + action.error.message;
        });
    }
});

export default manutencaoSlice.reducer;