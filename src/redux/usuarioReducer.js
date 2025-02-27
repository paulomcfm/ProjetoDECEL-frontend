import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado.js';
const urlBase = 'https://projetodecel-backend-production-85a1.up.railway.app/usuario';

// Função para salvar o estado de autenticação no localStorage
const saveAuthToLocalStorage = (state) => {
    localStorage.setItem('autenticado', state.autenticado);
    localStorage.setItem('nivelAcesso', state.nivelAcesso);
    localStorage.setItem('usuario', JSON.stringify(state.usuario));
};

// Função para carregar o estado de autenticação do localStorage
const loadAuthFromLocalStorage = () => {
    return {
        autenticado: localStorage.getItem('autenticado') === 'true',
        nivelAcesso: localStorage.getItem('nivelAcesso'),
        usuario: JSON.parse(localStorage.getItem('usuario'))
    };
};

export const logoutUsuario = createAsyncThunk('usuario/logout', async () => {
    localStorage.removeItem('autenticado'); // Remove a autenticação do localStorage
    localStorage.removeItem('nivelAcesso');
    localStorage.removeItem('usuario');
    return {};
});

export const buscarUsuarios = createAsyncThunk('usuario/buscar', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        console.log(resposta);
        const dados = await resposta.json();
        console.log(dados);
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
                nome: usuario.nome,
                senha: usuario.senha,
                cpf: usuario.cpf,
                email: usuario.email,
                celular: usuario.celular,
                nivel: usuario.nivel
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

export const autenticarUsuario = createAsyncThunk('/autenticar', async (credenciais) => {
    try {
        const resposta = await fetch("http://localhost:8080/autenticar", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciais)
        });
        const dados = await resposta.json();
        if (dados.status) {
            localStorage.setItem('autenticado', 'true'); // Armazena a autenticação no localStorage
            localStorage.setItem('nivelAcesso', dados.usuario.nivel); // Armazena o nível de acesso no localStorage
            localStorage.setItem('usuario', JSON.stringify(dados.usuario)); // Armazena o usuário no localStorage
            return {
                autenticado: true,
                usuario: dados.usuario
            };
        } else {
            return {
                autenticado: false,
                mensagem: dados.mensagem
            };
        }
    } catch (error) {
        return {
            autenticado: false,
            mensagem: 'Ocorreu um erro ao tentar autenticar: ' + error.message
        };
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
        console.log(dados);
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            usuario: {
                nome: usuario.nome,
                senha: usuario.senha,
                cpf: usuario.cpf,
                email: usuario.email,
                celular: usuario.celular, 
                nivel: usuario.nivel
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

export const solicitarCodigoRedefinicao = createAsyncThunk('/solicitar-redefinicao', async (email) => {
    const resposta = await fetch('http://localhost:8080/enviar-email/solicitar-redefinicao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return await resposta.json();
});

export const redefinirSenha = createAsyncThunk('/redefinirSenha', async ({ email, codigo, novaSenha }) => {
    const resposta = await fetch('http://localhost:8080/enviar-email/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo, novaSenha })
    });
    return await resposta.json();
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    usuarios: [],
    autenticado: false,
    nivelAcesso: "normal",
    usuario: null
};

// Carregar estado de autenticação do localStorage
const persistedState = loadAuthFromLocalStorage();


const usuarioSlice = createSlice({
    name: 'usuario',
    initialState: { ...initialState, ...persistedState },
    reducers: {},
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
        }).addCase(autenticarUsuario.fulfilled, (state, action) => {
            console.log("eeeeeeeeeeeee", action.payload.autenticado);
            if (action.payload.autenticado) {
                state.autenticado = true;
                state.mensagem = action.payload.mensagem;
                state.nivelAcesso = action.payload.usuario.nivel;
                state.usuario = action.payload.usuario;
                saveAuthToLocalStorage(state);
            } else {
                state.autenticado = false;
                state.mensagem = action.payload.mensagem;
                state.nivelAcesso = null;
                state.usuario = null;
                saveAuthToLocalStorage(state);
            }
        }).addCase(solicitarCodigoRedefinicao.pending, (state) => {
            state.estado = 'PENDENTE';
            state.mensagem = "Solicitando código de redefinição...";
        }).addCase(solicitarCodigoRedefinicao.fulfilled, (state, action) => {
            state.estado = 'OCIOSO';
            state.mensagem = action.payload.mensagem;
        }).addCase(solicitarCodigoRedefinicao.rejected, (state, action) => {
            state.estado = 'ERRO';
            state.mensagem = action.error.message;
        }).addCase(redefinirSenha.pending, (state) => {
            state.estado = 'PENDENTE';
            state.mensagem = "Redefinindo senha...";
        }).addCase(redefinirSenha.fulfilled, (state, action) => {
            state.estado = 'OCIOSO';
            state.mensagem = action.payload.mensagem;
        }).addCase(redefinirSenha.rejected, (state, action) => {
            state.estado = 'ERRO';
            state.mensagem = action.error.message;
        }).addCase(logoutUsuario.fulfilled, (state) => {
            state.autenticado = false;
            state.nivelAcesso = "normal";
        });
    }
});

export default usuarioSlice.reducer;