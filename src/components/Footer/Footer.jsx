import styles from "./Footer.module.css"

export default function Footer() {
    return (
        <div className={styles.container}>
            <div className={styles.topic}>
                <h4>About</h4>
            </div>

            <div className={styles.topic}>
                <h4>Legal</h4>
                <a href="/imprint">Impressum</a>
                <a>Datenschutzerklärung</a>
            </div>
        </div>

    );
}