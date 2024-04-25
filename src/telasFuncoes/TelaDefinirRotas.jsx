import TabelaRotas from "../telasCadastro/tabelas/TabelaRotas";
import FormularioRotas from "./FormularioRotas";
import Pagina from "../templates/Pagina";
import { useState,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { buscarRotas } from "../redux/rotaReducer";
import MapaPagina from "../telasSaida/MapaPagina";

export default function TelaDefinirRotas(){

    const formVazio = {
        codigo:0,
        nome:'',
        km:0,
        periodo:'M',
        ida:'',
        volta:'',
        veiculo:1,
        monitor:1,
        motoristas:[],
        pontos:[]
    }

    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(buscarRotas());
    }, [dispatch]);

    const { estado, mensagem, rotas } = useSelector(state => state.rota);

    const [tela,setTela] = useState(1)
    const [modoEdicao,setModoEdicao] = useState('gravar')
    const [form,setForm] = useState(formVazio)
    const [enderecos,setEnderecos] = useState([])


    return (
        <Pagina>
            {tela === 1? <TabelaRotas setEnderecos={setEnderecos} formVazio={formVazio} modoEdicao={modoEdicao} setModoEdicao={setModoEdicao} setTela={setTela} form={form} setForm={setForm}/>:tela === 2?<FormularioRotas form={form} setForm={setForm} formVazio={formVazio} modoEdicao={modoEdicao} setModoEdicao={setModoEdicao} setTela={setTela}/>:<MapaPagina enderecos={enderecos}/>}
        </Pagina>
    )
}