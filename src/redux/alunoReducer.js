import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'http://localhost:4000/aluno';

export const buscarAlunos = createAsyncThunk('aluno/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaAlunos: dados.listaAlunos,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaAlunos: [],
                mensagem: 'Ocorreu um erro ao recuperar os alunos da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaAlunos: [],
            mensagem: 'Ocorreu um erro ao recuperar os alunos da base de dados:' + erro.message
        }
    }
});

export const adicionarAluno = createAsyncThunk('aluno/adicionar', async (aluno) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o aluno:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            aluno: {
                codigoGerado: dados.codigoGerado,
                nome: aluno.nome,
                rg: aluno.rg,
                dataNasc: aluno.dataNasc,
                observacoes: aluno.observacoes
            }
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o aluno.',
            aluno
        }
    }
});

export const atualizarAluno = createAsyncThunk('aluno/atualizar', async (aluno) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o aluno:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            aluno: {
                codigoGerado: dados.codigoGerado,
                nome: aluno.nome,
                rg: aluno.rg,
                dataNasc: aluno.dataNasc,
                observacoes: aluno.observacoes
            }
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o aluno.',
            aluno
        }
    }
});

export const removerAluno = createAsyncThunk('aluno/remover', async (aluno) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o aluno:' + erro.message,
            aluno
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            aluno
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o aluno.',
            aluno
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    alunos: []
};

const alunoSlice = createSlice({
    name: 'aluno',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarAlunos.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando alunos...";
        }).addCase(buscarAlunos.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.alunos = action.payload.listaAlunos;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarAlunos.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarAluno.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.alunos.push(action.payload.aluno);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarAluno.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando aluno...";
        }).addCase(adicionarAluno.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar o aluno: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarAluno.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.alunos.findIndex(aluno => aluno.codigo === action.payload.aluno.codigo);
            state.alunos[indice] = action.payload.aluno;
            state.mensagem = action.payload.mensagem;

        }).addCase(atualizarAluno.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando aluno...";
        }).addCase(atualizarAluno.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar o aluno: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerAluno.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.alunos = state.alunos.filter(aluno => aluno.codigo !== action.payload.aluno.codigo);
        }).addCase(removerAluno.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo aluno...";
        }).addCase(removerAluno.rejected, (state, action) => {
            state.mensagem = "Erro ao remover o aluno: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default alunoSlice.reducer;