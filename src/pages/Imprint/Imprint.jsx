import styles from "./Imprint.module.css"

export default function Imprint() {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1>Impressum</h1>
                <h3>Angaben gemäß § 5 DDG</h3>

                <div className={styles.personen}>
                    <p>David Schmidt</p>
                    <p>Sonnenscheinstraße 32<br />53359 Rheinbach</p>
                </div>

                <div className={styles.contact}>
                    <h2>Kontakt:</h2>
                    <div className={styles.contactGrid}>
                        <p>Telefon:</p><p>+49-176 72912101</p>
                        <p>E-Mail:</p><p><a>davidschmidtp@gmail.com</a></p>
                    </div>
                </div>

                <div className={styles.misc}>
                    <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                    <p>Wir nehmen nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil und sind dazu auch nicht verpflichtet.</p>
                </div>

                <p>Impressum von <a href="https://impressum-generator.de" rel="dofollow">Impressum-Generator.de</a>. Powered by <a href="https://www.kanzlei-hasselbach.de/" rel="nofollow">Franziska Hasselbach, Bonn</a>.</p>
            </div>
        </div>
    );
}