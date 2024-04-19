import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'http://localhost:8080/parentesco';
// const urlBase = 'https://projetodecel-backend.onrender.com/parentesco';

export const buscarParentescos = createAsyncThunk('parentesco/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaParentescos: dados.listaParentescos,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaParentescos: [],
                mensagem: 'Ocorreu um erro ao recuperar os parentescos da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaParentescos: [],
            mensagem: 'Ocorreu um erro ao recuperar os parentescos da base de dados:' + erro.message
        }
    }
});

export const buscarParentescosAluno = createAsyncThunk('parentesco/buscar', async (codigoAluno) => {
    try {
        const resposta = await fetch(urlBase+"/aluno/"+codigoAluno, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaParentescos: dados.listaParentescos,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaParentescos: [],
                mensagem: 'Ocorreu um erro ao recuperar os parentescos da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaParentescos: [],
            mensagem: 'Ocorreu um erro ao recuperar os parentescos da base de dados:' + erro.message
        }
    }
});

export const buscarParentescosResponsavel = createAsyncThunk('parentesco/buscar', async (codigoResponsavel) => {
    try {
        const resposta = await fetch(urlBase+"/responsavel/"+codigoResponsavel, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaParentescos: dados.listaParentescos,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaParentescos: [],
                mensagem: 'Ocorreu um erro ao recuperar os parentescos da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaParentescos: [],
            mensagem: 'Ocorreu um erro ao recuperar os parentescos da base de dados:' + erro.message
        }
    }
});

export const adicionarParentesco = createAsyncThunk('parentesco/adicionar', async (parentesco) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parentesco)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o parentesco:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            parentesco
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o parentesco.',
            parentesco
        }
    }
});

export const atualizarParentesco = createAsyncThunk('parentesco/atualizar', async (parentesco) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parentesco)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o parentesco:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            parentesco
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o parentesco.',
            parentesco
        }
    }
});

export const removerParentesco = createAsyncThunk('parentesco/remover', async (parentesco) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parentesco)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o parentesco:' + erro.message,
            parentesco
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            parentesco
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o parentesco.',
            parentesco
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    parentescos: []
};

const parentescoSlice = createSlice({
    name: 'parentesco',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarParentescos.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando parentescos...";
        }).addCase(buscarParentescos.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.parentescos = action.payload.listaParentescos;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarParentescos.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarParentesco.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.parentescos.push(action.payload.parentesco);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarParentesco.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando parentesco...";
        }).addCase(adicionarParentesco.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar o parentesco: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarParentesco.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.parentescos.findIndex(parentesco => parentesco.codigo === action.payload.parentesco.codigo);
            state.parentescos[indice] = action.payload.parentesco;
            state.mensagem = action.payload.mensagem;

        }).addCase(atualizarParentesco.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando parentesco...";
        }).addCase(atualizarParentesco.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar o parentesco: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerParentesco.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.parentescos = state.parentescos.filter(parentesco => parentesco.codigo !== action.payload.parentesco.codigo);
        }).addCase(removerParentesco.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo parentesco...";
        }).addCase(removerParentesco.rejected, (state, action) => {
            state.mensagem = "Erro ao remover o parentesco: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default parentescoSlice.reducer;