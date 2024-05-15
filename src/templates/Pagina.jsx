import React from 'react';
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";
import './style.css';


export default function Pagina(props) {
    return (
        <div style={{ paddingBottom: '50px' }}>
            <Cabecalho />
            <div className="pagina-content" style={{ marginBottom: '50px' }}>
                {props.children}
            </div>
            <div style={{ position: 'fixed', bottom: 0, width: '100%', height: '8%', backgroundColor: '#f8f9fa' }}>
                <Rodape conteudo="Rua Vicente Dias Garcia, nº 222, Álvares Machado - CNPJ: 31.048.096/0001-91" />
            </div>
        </div>
    );
}
