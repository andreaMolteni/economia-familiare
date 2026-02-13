import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
    return (
        <div style={{ maxWidth: 520, margin: "60px auto", padding: 16 }}>
            <h2>Sessione scaduta o non autorizzato</h2>
            <p>Per continuare effettua di nuovo il login.</p>
            <Link to="/login">Vai al login</Link>
        </div>
    );
}