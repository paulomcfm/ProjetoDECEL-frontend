export default function validarRG(rg) {
    // Expressão regular para validar o formato do RG
    const regexRG = /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9Xx]$/;

    // Verificar se o RG corresponde ao formato esperado
    return regexRG.test(rg);
}