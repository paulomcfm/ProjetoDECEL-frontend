import TabelaRotas from "./tabelas/TabelaRotas";
import FormularioRotas from "../telasFuncoes/FormularioRotas";
import Pagina from "../templates/Pagina";
import { useState } from "react";

export default function TelaDefinirRotas(){

    const formVazio = {
        nome:'',
        periodo:'Manhã',
        ida:'',
        volta:'',
        veiculo:1,
        monitor:1,
        motoristas:[],
        pontos:[]
    }

    const [modo,setModo] = useState(false)



    return (
        <Pagina>
            {modo? <TabelaRotas/>:<FormularioRotas formVazio={formVazio}/>}
        </Pagina>
    )
}