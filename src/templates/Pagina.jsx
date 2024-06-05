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
            <div style={{ position: 'fixed', bottom: 0, width: '100%', height: '6%', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Rodape />
            </div>
        </div>
    );
}
