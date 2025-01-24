import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'https://projetodecel-backend-production-85a1.up.railway.app/inscricao-aluno';

export const buscarInscricoes = createAsyncThunk('inscricao-aluno/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaInscricoes: dados.listaInscricoes,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaInscricoes: [],
                mensagem: 'Ocorreu um erro ao recuperar as inscrições da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaInscricoes: [],
            mensagem: 'Ocorreu um erro ao recuperar as inscrições da base de dados:' + erro.message
        }
    }
});

export const getInscricoesFora = createAsyncThunk('inscricao-aluno/buscar-fora', async (ano) => {
    try {
        const resposta = await fetch(urlBase+"/buscar-fora/"+ ano, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaInscricoes: dados.listaInscricoes,
                mensagem: dados.mensagem
            }
        }
        else {
            return {
                status: false,
                listaInscricoes: [],
                mensagem: 'Ocorreu um erro ao recuperar as inscrições da base de dados.' + dados.mensagem
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaInscricoes: [],
            mensagem: 'Ocorreu um erro ao recuperar as inscrições da base de dados:' + erro.message
        }
    }
});

export const getInscricoesDesatualizadas = createAsyncThunk('inscricao-aluno/buscar-desatualizadas', async (ano) => {
    try {
        const resposta = await fetch(urlBase+"/buscar-desatualizadas/"+ ano, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaInscricoes: dados.listaInscricoes,
                mensagem: dados.mensagem
            }
        }
        else {
            return {
                status: false,
                listaInscricoes: [],
                mensagem: 'Ocorreu um erro ao recuperar as inscrições da base de dados.' + dados.mensagem
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaInscricoes: [],
            mensagem: 'Ocorreu um erro ao recuperar as inscrições da base de dados:' + erro.message
        }
    }
});

export const adicionarInscricao = createAsyncThunk('inscricao-aluno/adicionar', async (inscricao) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inscricao)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a inscrição:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            inscricao
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a inscrição.',
            inscricao
        }
    }
});


export const atualizarInscricao = createAsyncThunk('inscricao-aluno/atualizar', async (inscricao) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inscricao)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a inscrição:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            inscricao
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a inscrição.',
            inscricao
        }
    }
});

export const removerInscricao = createAsyncThunk('inscricao-aluno/remover', async (inscricao) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inscricao)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a inscrição:' + erro.message,
            inscricao
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            inscricao
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a inscrição.',
            inscricao
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    inscricoes: []
};

const inscricaoSlice = createSlice({
    name: 'inscricao',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarInscricoes.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando inscrições...";
        }).addCase(buscarInscricoes.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.inscricoes = action.payload.listaInscricoes;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarInscricoes.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(getInscricoesFora.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando inscrições...";
        }).addCase(getInscricoesFora.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.inscricoes = action.payload.listaInscricoes;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(getInscricoesFora.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        })
        .addCase(getInscricoesDesatualizadas.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando inscrições...";
        }).addCase(getInscricoesDesatualizadas.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.inscricoes = action.payload.listaInscricoes;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(getInscricoesDesatualizadas.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        })
        .addCase(adicionarInscricao.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.inscricoes.push(action.payload.inscricao);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarInscricao.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando inscrição...";
        }).addCase(adicionarInscricao.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar a inscrição: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarInscricao.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const { ano, aluno: { codigo } } = action.payload.inscricao;
            const indice = state.inscricoes.findIndex(inscricao => inscricao.ano === ano && inscricao.aluno.codigo === codigo);
            state.inscricoes[indice] = action.payload.inscricao;
            state.mensagem = action.payload.mensagem;
        }).addCase(atualizarInscricao.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando inscrição...";
        }).addCase(atualizarInscricao.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar a inscrição: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerInscricao.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            const { ano, aluno: { codigo } } = action.payload.inscricao;
            state.inscricoes = state.inscricoes.filter(inscricao => inscricao.ano !== ano || inscricao.aluno.codigo !== codigo);
        }).addCase(removerInscricao.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo inscrição...";
        }).addCase(removerInscricao.rejected, (state, action) => {
            state.mensagem = "Erro ao remover a inscrição: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default inscricaoSlice.reducer;