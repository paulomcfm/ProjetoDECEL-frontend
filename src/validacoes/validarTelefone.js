export default function validarTelefone(telefone) {
    // Expressão regular para validar números de telefone no formato brasileiro
    const regexTelefone = /^\([1-9]{2}\) [2-9][0-9]{3,4}\-[0-9]{4}$/;

    // Verificar se o telefone corresponde ao formato esperado
    return regexTelefone.test(telefone);
}