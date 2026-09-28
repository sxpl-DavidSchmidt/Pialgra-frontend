import styles from "./Footer.module.css"
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Link to="/imprint">Imprint</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="https://github.com/sxpl-DavidSchmidt/Pialgra-frontend">Source Code: Frontend</Link>
                <Link to="https://github.com/sxpl-DavidSchmidt/Pialgra-backend">Source Code: Backend</Link>
            </div>
        </div>

    );
}
