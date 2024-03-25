import React from 'react';
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";
import './style.css';


export default function Pagina(props) {
    return (
        <>
            <Cabecalho />
            <div className="pagina-content">
                {
                    //Filhos da página
                }
                {props.children}
            </div>  
            <Rodape conteudo="Rua Vicente Dias Garcia, nº 222, Álvares Machado - CNPJ: 31.048.096/0001-91" />
        </>
    );
}