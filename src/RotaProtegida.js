import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RotaProtegida = ({ children }) => {
    const autenticado = useSelector(state => state.usuario.autenticado)
    console.log(autenticado);
    return autenticado ? children : <Navigate to="/" />;
};

export default RotaProtegida;