import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <ul>
        <li className={styles.homeLi}>
          <a href="#" className={styles.activeLink}>
            Home
          </a>
        </li>
        <li>
          <a href="#">Subjects</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#" className={styles.accentLink}>
            Login
          </a>
        </li>
      </ul>
    </nav>
  );
}
