const nodemailer = require('nodemailer');

// Configurações do seu provedor de e-mail (substitua com suas próprias credenciais)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Função para enviar e-mail com o código
async function enviarCodigoPorEmail(destinatario, codigo, provedor) {
    console.log(nodemailer);
    try {
        // Opções do e-mail
        const mailOptions = {
            from: `${provedor}`,
            to: destinatario,
            subject: 'Código de Verificação',
            text: `Seu código de verificação é: ${codigo}`
        };

        // Envia o e-mail
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado: ', info.response);
        return true; // Indica que o e-mail foi enviado com sucesso
    } catch (error) {
        console.error('Erro ao enviar e-mail: ', error);
        return false; // Indica que houve um erro ao enviar o e-mail
    }
}

module.exports = { enviarCodigoPorEmail };