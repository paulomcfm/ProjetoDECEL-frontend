export default function Rodape(props) {
    return (
        <footer className="page-footer font-small blue pt-4" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="footer-copyright text-center py-3">{props.conteudo}</div>
        </footer>
    );
}
