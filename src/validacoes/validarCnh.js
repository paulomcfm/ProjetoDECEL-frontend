export default function validarCNH(PVRegCnh) {
    // Remover espaços em branco do início e do final da string
    PVRegCnh = PVRegCnh.trim();

    // Se o comprimento da CNH fornecida for menor que 11, retornar "F"
    if (PVRegCnh.length < 11) {
        return false;
    }

    // Extrair os primeiros 9 dígitos da CNH fornecida
    const CNH_Forn = PVRegCnh.substring(0, 9);

    // Extrair os últimos 2 dígitos da CNH fornecida
    const Dig_Forn = PVRegCnh.substring(9);

    // Inicializar variáveis
    let Soma = 0;
    let Mult = 9;
    let Digito1, Digito2, Incr_dig2 = 0;

    // Calcular o primeiro dígito verificador
    for (let j = 0; j < 9; j++) {
        Soma += parseInt(CNH_Forn.charAt(j)) * Mult;
        Mult--;
    }
    Digito1 = Soma % 11;
    if (Digito1 === 10) {
        Incr_dig2 = -2;
    }
    if (Digito1 > 9) {
        Digito1 = 0;
    }

    // Calcular o segundo dígito verificador
    Soma = 0;
    Mult = 1;
    for (let j = 0; j < 9; j++) {
        Soma += parseInt(CNH_Forn.charAt(j)) * Mult;
        Mult++;
    }
    Digito2 = (Soma % 11) + Incr_dig2;
    if (Digito2 < 0) {
        Digito2 += 11;
    }
    if (Digito2 > 9) {
        Digito2 = 0;
    }

    // Verificar se os dígitos verificadores correspondem aos últimos dois dígitos da CNH
    const Dig_Enc = Digito1.toString() + Digito2.toString();
    console.log("fim")
    if (Dig_Forn === Dig_Enc) {
        return true;
    } else {
        return false;
    }
}
