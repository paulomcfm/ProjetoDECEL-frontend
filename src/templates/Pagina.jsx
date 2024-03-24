import React from 'react';
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";


export default function Pagina(props) {
    return (
        <>
            <Cabecalho />
            <div>
                {
                    //Filhos da página = props children
                }
                {props.children}
            </div>  
            <Rodape conteudo="Rua X, 10 - Vila - Presidente Prudente/SP - CNPJ: 00.000.000/0001-00" />
        </>
    );
}