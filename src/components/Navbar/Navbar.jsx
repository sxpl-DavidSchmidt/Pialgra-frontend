import styles from "./Navbar.module.css";
import Logo from "../../assets/logo/pialgra_logo_notext.svg"

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <a href="/" className={styles.homeLi} style={{ backgroundColor: "white" }}>
        <img src={Logo} />
        <p>Pialgra</p>
      </a>
      <a href="/clock">Clock</a>
      <a href="/statistics">Statistics</a>
      <a href="/login" className={styles.accentLink}>Login</a>
    </nav>
  );
}
