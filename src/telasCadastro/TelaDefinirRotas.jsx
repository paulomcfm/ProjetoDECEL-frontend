import TabelaRotas from "./tabelas/TabelaRotas";
import FormularioRotas from "../telasFuncoes/FormularioRotas";
import Pagina from "../templates/Pagina";
import { useState } from "react";

export default function TelaDefinirRotas(){

    const formVazio = {
        nome:'',
        periodo:'',
        ida:'',
        volta:'',
        veiculo:0,
        monitor:0,
        motoristas:[],
        pontos:[]
    }

    const [modo,setModo] = useState(false)



    return (
        <Pagina>
            {modo? <TabelaRotas/>:<FormularioRotas/>}
        </Pagina>
    )
}