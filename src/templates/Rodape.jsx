export default function Rodape(props) {
    return (
        <footer>
            <div style={{
                backgroundColor: '#f2f2f2',
                borderTop: '1px solid #dee2e6',
                padding: '15px 20px',
                textAlign: 'center',
                color: '#495057',
                fontFamily: 'Arial, sans-serif',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                zIndex: 9999,
            }}>
                <p style={{ margin: 0, fontSize: '16px' }}>
                    {props.conteudo || "Rodapé do sistema."}
                </p>
            </div>
        </footer>
    );
}
