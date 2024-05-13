import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AlteraSenha() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    function handleAlterarSenha() {
        // Verificar se as senhas coincidem e atendem aos requisitos
        // Enviar solicitação para alterar a senha no backend
        // Redirecionar para a tela de login se a senha for alterada com sucesso
    }

    return (
        <Container>
            {/* Formulário de alteração de senha */}
        </Container>
    );
}