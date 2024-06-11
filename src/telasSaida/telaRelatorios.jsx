import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Pagina from '../templates/Pagina';
import { NavLink } from 'react-router-dom';
import { TbReportAnalytics } from "react-icons/tb";
import { PiStudentFill } from "react-icons/pi";
import { MdUpdate } from "react-icons/md";
import { TbRouteX  } from "react-icons/tb";
import '../templates/style.css';

export default function Relatorios(props) {
    const [termoBusca, setTermoBusca] = useState('');

    const relatorios = [
        {
            path: "/relatorios/alunos",
            title: "Alunos",
            description: "Filtros: escola, período e rota.",
            icon: <PiStudentFill style={{ width: '10%', height: '10%' }} />
        },
        {
            path: "/relatorios/alunos-nao-inscritos",
            title: "Inscrições",
            description: "Alunos não inscritos e desatualizados",
            icon: <MdUpdate style={{ width: '10%', height: '10%' }} />
        },
        {
            path: "/relatorios/rotas-diferentes",
            title: "Rotas",
            description: "Ponto de embarque fora dos pontos de sua rota",
            icon: <TbRouteX  style={{ width: '10%', height: '10%' }} />
        }
    ];

    const filteredRelatorios = relatorios.filter(relatorio =>
        relatorio.title.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <div className="background-image">
            <Pagina>
                <div style={{ margin: '2%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{ width: '50%' }}>
                        <input
                            type="text"
                            className="form-control"
                            style={{
                                borderRadius: '10px 10px 10px 10px',
                                padding: '12px 16px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #ced4da',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                            }}
                            placeholder="Buscar Relatórios..."
                            value={termoBusca}
                            onChange={e => setTermoBusca(e.target.value)}
                        />
                    </div>
                    <Container style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', marginLeft: '4%', marginRight: '4%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ margin: '1%', fontSize: '25px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <TbReportAnalytics style={{marginBottom: '1%'}}/>
                            <p><strong>Relatórios</strong></p>
                        </div>
                        <div className="mb-3" style={{ marginLeft: '1%', marginRight: '1%', gap: '1%', height: '15%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {filteredRelatorios.map((relatorio, index) => (
                                <div className="p-1" style={{ display: 'flex', width: '32%' }} key={index}>
                                    <div className="imagem-botao hover-scale rounded shadow" style={{ outline: '2px solid lightgray', outlineOffset: '-4px' }}>
                                        <NavLink to={relatorio.path} className="nav-link" style={{ marginLeft: '10px' }}>
                                            <p style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '30px' }}>{relatorio.title}</p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '10%', marginTop: '-10%' }}>
                                                {relatorio.icon}
                                            </div>
                                            <p>{relatorio.description}</p>
                                        </NavLink>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </div>
            </Pagina>
        </div>
    );
}
