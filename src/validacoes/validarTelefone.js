export default function validarTelefone(telefone) {
    // Expressão regular para validar números de telefone no formato brasileiro
    const regexTelefone = /^[1-9]{2}[0-9]{9}$/;

    // Verificar se o telefone corresponde ao formato esperado
    return regexTelefone.test(telefone);
}