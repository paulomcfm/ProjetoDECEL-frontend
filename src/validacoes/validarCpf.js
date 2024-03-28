export default function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) return false; // Verifica se o CPF tem 11 dígitos e se todos são iguais

    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit = (remainder >= 10) ? 0 : remainder;

    if (parseInt(cpf.charAt(9)) !== digit) return false; // Verifica se o primeiro dígito verificador está correto

    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    digit = (remainder >= 10) ? 0 : remainder;

    return parseInt(cpf.charAt(10)) === digit; // Retorna true se o CPF for válido, false caso contrário
}