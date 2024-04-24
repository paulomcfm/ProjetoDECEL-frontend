import TabelaRotas from "./tabelas/TabelaRotas";
import FormularioRotas from "../telasFuncoes/FormularioRotas";
import Pagina from "../templates/Pagina";
import { useState } from "react";

export default function TelaDefinirRotas(){

    const formVazio = {
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

    const [modo,setModo] = useState(true)
    const [modoEdicao,setModoEdicao] = useState('gravar')



    return (
        <Pagina>
            {modo? <TabelaRotas/>:<FormularioRotas formVazio={formVazio} modoEdicao={modoEdicao} setModoEdicao={setModoEdicao}/>}
        </Pagina>
    )
}