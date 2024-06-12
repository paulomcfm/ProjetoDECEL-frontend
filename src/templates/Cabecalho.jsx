import React, { useState, useEffect } from 'react';
import logo from '../recursos/logodecel.png';
import user from '../recursos/avatarPadrao.png';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUsuario } from '../redux/usuarioReducer';
import './style.css';

export default function Cabecalho(props) {
    const [nomeUsuario, setNomeUsuario] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { nivelAcesso } = useSelector(state => state.usuario);

    useEffect(() => {
        const usuarioLogado = localStorage.getItem('usuario');
        if (usuarioLogado) {
            const usuario = JSON.parse(usuarioLogado);
            setNomeUsuario(usuario?.nome);
        }
    }, []);

    const handleLogout = () => {
        dispatch(logoutUsuario());
        navigate('/');
    };

    return (
        <Navbar expand="lg" variant="light" bg="light" className="custom-navbar">
            <Navbar.Brand as={NavLink} to="/menu" className="brandLogo mr-auto">
                <img
                    src={logo}
                    alt="Logo DECEL"
                    className="img-fluid"
                    style={{ maxHeight: '40px' }}
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <NavLink exact to="/menu" className="nav-link">Início</NavLink>
                    <NavLink to="/veiculos" className="nav-link">Veículos</NavLink>
                    <NavLink to="/alunos" className="nav-link">Alunos</NavLink>
                    <NavLink to="/responsaveis" className="nav-link">Responsáveis</NavLink>
                    <NavLink to="/escolas" className="nav-link">Escolas</NavLink>
                    <NavLink to="/pontos-embarque" className="nav-link">Pontos de Embarque</NavLink>
                    <NavLink to="/motorista" className="nav-link">Motoristas</NavLink>
                    <NavLink to="/monitor" className="nav-link">Monitores</NavLink>
                    {nivelAcesso === 'administrador' && <NavLink to="/cadastro-user" className="nav-link">Usuários</NavLink>}
                </Nav>
            </Navbar.Collapse>
            <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                    <span>{nomeUsuario}</span>
                    <img
                        src={user}
                        alt="Imagem Usuário"
                        className="img-fluid"
                        style={{ maxHeight: '40px', cursor: 'pointer', marginLeft: '10px', marginRight: '83px' }}
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout} style={{ textAlign: 'center' }}>Sair</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Navbar>
    );
}