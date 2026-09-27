import styles from "./Footer.module.css"
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div className={styles.container}>
            <div className={styles.topic}>
                <h4>About</h4>
            </div>

            <div className={styles.topic}>
                <h4>Legal</h4>
                <Link to="/imprint">Impressum</Link>
                <Link to="/privacy">Datenschutz: Anmeldung und Cookies</Link>
            </div>
        </div>

    );
}
