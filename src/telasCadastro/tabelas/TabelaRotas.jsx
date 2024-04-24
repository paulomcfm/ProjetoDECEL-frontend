import { useState,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { buscarRotas } from "../../redux/rotaReducer";

export default function TabelaRotas(props){
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(buscarRotas());
    }, [dispatch]);

    const { estado, mensagem, rotas } = useSelector(state => state.rota);

    console.log(rotas)

    return (
        <>
        
        </>
    )
}
