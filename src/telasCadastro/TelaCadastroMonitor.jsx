import TabelaMonitor from "./tabelas/TabelaMonitor";
import FormMonitor from "./formularios/FormMonitor";
import Pagina from "../templates/Pagina";
import { useState } from "react";

export default function TelaCadastroMonitor(){
    const monitorVazio = {
        codigo:0,
        nome:'',
        cpf:'',
        celular:''
    }
    const [monitor,setMonitor] = useState(monitorVazio)
    const [tela,setTela] = useState(true)
    const [modo,setModo] = useState('gravar')

    return (
        <Pagina>
            { tela? <TabelaMonitor monitor={monitor} setMonitor={setMonitor} tela={tela} setTela={setTela} modo={modo} setModo={setModo} />:<FormMonitor monitor={monitor} setMonitor={setMonitor} tela={tela} setTela={setTela} modo={modo} setModo={setModo} /> }
        </Pagina>
    )
}