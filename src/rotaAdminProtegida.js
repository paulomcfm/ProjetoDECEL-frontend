import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RotaAdminProtegida = ({ children }) => {
    const autenticado = useSelector(state => state.autenticado);
    const isAdmin = useSelector(state => state.usuario.nivelAcesso === "admin");
    
    if (!autenticado) {
        return <Navigate to="/" />;
    }
    
    return isAdmin ? children : <div>Você não tem permissão de acesso a esta parte do sistema.</div>;
};

export default RotaAdminProtegida;