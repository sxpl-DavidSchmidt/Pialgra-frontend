import styles from "./Navbar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <ul>
        <li className={styles.homeLi}><a href="/" className={styles.activeLink}>Home</a></li>
        <li><a href="/clock">Clock</a></li>
        <li><a href="/timer">Statistics</a></li>
      </ul>
    </nav>
  );
}
