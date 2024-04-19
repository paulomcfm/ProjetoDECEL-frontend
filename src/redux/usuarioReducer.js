import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'https://projetodecel-backend.onrender.com/usuario';

export const buscarUsuarios = createAsyncThunk('usuario/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaUsuarios: dados.listaUsuarios,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaUsuarios: [],
                mensagem: 'Ocorreu um erro ao recuperar os usuários da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaUsuarios: [],
            mensagem: 'Ocorreu um erro ao recuperar os usuários da base de dados:' + erro.message
        }
    }
});

export const adicionarUsuario = createAsyncThunk('usuario/adicionar', async (usuario) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o usuário:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            usuario: {
                codigoGerado: dados.codigoGerado,
                nome: usuario.nome,
                senha: usuario.senha,
                cpf: usuario.cpf,
                email: usuario.email,
                celular: usuario.celular,
                categoria: usuario.categoria
            }
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o usuário.',
            usuario
        }
    }
});

export const atualizarUsuario = createAsyncThunk('usuario/atualizar', async (usuario) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o usuário:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            usuario: {
                codigoGerado: dados.codigoGerado,
                nome: usuario.nome,
                senha: usuario.senha,
                cpf: usuario.cpf,
                email: usuario.email,
                celular: usuario.celular,
                categoria: usuario.categoria
            }
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o usuário.',
            usuario
        }
    }
});

export const removerUsuario = createAsyncThunk('usuario/remover', async (usuario) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o usuário:' + erro.message,
            usuario
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            usuario
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o usuário.',
            usuario
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    usuarios: []
};

const usuarioSlice = createSlice({
    name: 'usuario',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(buscarUsuarios.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Buscando usuários...";
        }).addCase(buscarUsuarios.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.usuarios = action.payload.listaUsuarios;
            } else {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            }
        }).addCase(buscarUsuarios.rejected, (state, action) => {
            state.estado = ESTADO.ERRO;
            state.mensagem = action.error.message;
        }).addCase(adicionarUsuario.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.usuarios.push(action.payload.usuario);
            state.mensagem = action.payload.mensagem;
        }).addCase(adicionarUsuario.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Adicionando usuário...";
        }).addCase(adicionarUsuario.rejected, (state, action) => {
            state.mensagem = "Erro ao adicionar o usuário: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(atualizarUsuario.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            const indice = state.usuarios.findIndex(usuario => usuario.codigo === action.payload.usuario.codigo);
            state.usuarios[indice] = action.payload.usuario;
            state.mensagem = action.payload.mensagem;

        }).addCase(atualizarUsuario.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Atualizando usuário...";
        }).addCase(atualizarUsuario.rejected, (state, action) => {
            state.mensagem = "Erro ao atualizar o usuário: " + action.error.message;
            state.estado = ESTADO.ERRO;
        }).addCase(removerUsuario.fulfilled, (state, action) => {
            state.estado = ESTADO.OCIOSO;
            state.mensagem = action.payload.mensagem;
            state.usuarios = state.usuarios.filter(usuario => usuario.codigo !== action.payload.usuario.codigo);
        }).addCase(removerUsuario.pending, (state, action) => {
            state.estado = ESTADO.PENDENTE;
            state.mensagem = "Removendo usuário...";
        }).addCase(removerUsuario.rejected, (state, action) => {
            state.mensagem = "Erro ao remover o usuário: " + action.error.message;
            state.estado = ESTADO.ERRO;
        })
    }
});

export default usuarioSlice.reducer;