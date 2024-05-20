import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function TelaAlertaManutencao(props) {
    const [listaManutencao, setListaManutencao] = useState([
        {
            "placa": "ABC123",
            "manutencoes": [
                {
                    "codigo": 1,
                    "tipo": "P",
                    "data": "2024-04-22",
                    "observacoes": "Troca de óleo e filtros"
                },
                {
                    "codigo": 5,
                    "tipo": "P",
                    "data": "2024-06-20",
                    "observacoes": "Verificação dos freios"
                },
                {
                    "codigo": 9,
                    "tipo": "P",
                    "data": "2024-08-05",
                    "observacoes": "Troca de óleo e filtros"
                }
            ]
        },
        {
            "placa": "DEF456",
            "manutencoes": [
                {
                    "codigo": 3,
                    "tipo": "P",
                    "data": "2024-05-15",
                    "observacoes": "Revisão do motor"
                },
                {
                    "codigo": 7,
                    "tipo": "P",
                    "data": "2024-07-10",
                    "observacoes": "Troca de óleo e filtros"
                }
            ]
        },
        {
            "placa": "GHI789",
            "manutencoes": [
                {
                    "codigo": 4,
                    "tipo": "C",
                    "data": "2024-06-10",
                    "observacoes": "Troca de filtros"
                },
                {
                    "codigo": 8,
                    "tipo": "C",
                    "data": "2024-07-20",
                    "observacoes": "Reparo na parte elétrica"
                }
            ]
        },
        {
            "placa": "XYZ789",
            "manutencoes": [
                {
                    "codigo": 2,
                    "tipo": "C",
                    "data": "2024-05-05",
                    "observacoes": "Substituição de pneus"
                },
                {
                    "codigo": 6,
                    "tipo": "C",
                    "data": "2024-07-01",
                    "observacoes": "Reparo na suspensão"
                },
                {
                    "codigo": 10,
                    "tipo": "C",
                    "data": "2024-08-15",
                    "observacoes": "Substituição de pneus"
                }
            ]
        }
    ]);

    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

    function handleButtonClick(index) {
        if (veiculoSelecionado === index) {
            // Se o mesmo botão for clicado novamente, fecha a tabela
            setVeiculoSelecionado(null);
        } else {
            // Caso contrário, exibe a tabela correspondente ao botão clicado
            setVeiculoSelecionado(index);
        }
    }

    function listarVeiculos(veiculo, index) {
        return (
            <div key={veiculo.placa} style={{width:'100%',marginTop:'2px'}}>
                <Button style={{ marginLeft: '50%'}} onClick={() => handleButtonClick(index)}>
                    {veiculo.placa}
                </Button>
                {veiculoSelecionado === index && listarManutencoes(veiculo.manutencoes)}
            </div>
        );
    }

    function listarManutencoes(manutencoes) {
        return (
            <table className='tabela' style={{ width: '100%' }}>
                <thead className='head-tabela'>
                    <tr>
                        <th className='linhas-titulo-tabela'>Tipo</th>
                        <th className='linhas-titulo-tabela'>Data</th>
                        <th className='linhas-titulo-tabela'>Observações</th>
                    </tr>
                </thead>
                <tbody>
                    {manutencoes.map(manut => (
                        <tr key={manut.codigo}>
                            <td className='linhas-tabela'>{manut.tipo === 'P' ? "Preventiva" : "Corretiva"}</td>
                            <td className='linhas-tabela'>{manut.data}</td>
                            <td className='linhas-tabela'>{manut.observacoes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100%' }}>
            {listaManutencao.map((veiculo, index) => (
                listarVeiculos(veiculo, index)
            ))}
        </div>
    );
}
