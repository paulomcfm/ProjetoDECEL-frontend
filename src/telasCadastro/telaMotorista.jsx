import { useState } from "react";
import Pagina from "../templates/Pagina";
import FormMotorista from './formularios/FormMotorista'
import TabelaMotorista from "./tabelas/TabelaMotorista";
export default function TelaMotorista(){
    const [modo,setModo] = useState('gravar')
    const [tela,setTela] = useState(true)
    const motoLimpo = {
        nome:"",
        cnh:"",
        telefone:""
    }
    const [motorista,setMotorista] = useState(motoLimpo)
    return(
        <Pagina>
            {
                tela === true? 
                    <TabelaMotorista setModo={setModo} setTela={setTela} setMotorista={setMotorista} motoLimpo={motoLimpo}/>
                    :
                    <FormMotorista modo={modo} setModo={setModo} setTela={setTela} motorista={motorista} setMotorista={setMotorista} motoLimpo={motoLimpo}/> 
            }
        </Pagina>
    )
}