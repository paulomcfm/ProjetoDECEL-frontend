import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const RotaProtegida = ({ children }) => {
    const location = useLocation();
    const autenticado = location.state?.autenticado;
    console.log(autenticado);
    return autenticado ? children : <Navigate to="/" />;
};

export default RotaProtegida;