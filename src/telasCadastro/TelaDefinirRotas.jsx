import TabelaRotas from "./tabelas/TabelaRotas";
import FormularioRotas from "../telasFuncoes/FormularioRotas";
import Pagina from "../templates/Pagina";
import { useState,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { buscarRotas } from "../redux/rotaReducer";

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

    const [tela,setTela] = useState(true)
    const [modoEdicao,setModoEdicao] = useState('gravar')
    const [form,setForm] = useState(formVazio)


    return (
        <Pagina>
            {tela? <TabelaRotas formVazio={formVazio} modoEdicao={modoEdicao} setModoEdicao={setModoEdicao} setTela={setTela} form={form} setForm={setForm}/>:<FormularioRotas form={form} setForm={setForm} formVazio={formVazio} modoEdicao={modoEdicao} setModoEdicao={setModoEdicao} setTela={setTela}/>}
        </Pagina>
    )
}