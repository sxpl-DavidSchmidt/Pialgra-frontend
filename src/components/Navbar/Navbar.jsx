import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

import styles from "./Navbar.module.css";
import Logo from "../../assets/logo/pialgra_logo_notext.svg";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className={styles.navBar}>
      <Link
        to="/"
        className={styles.homeLi}
        style={{ backgroundColor: "white" }}
      >
        <img src={Logo} alt="Pialgra" />
        <p>Pialgra</p>
      </Link>

      <Link to="/clock">Clock</Link>
      <Link to="/statistics">Statistics</Link>

      {!loading && (
        user ? (
          <button
            type="button"
            className={styles.accentLink}
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className={styles.accentLink}
          >
            Login
          </Link>
        )
      )}
    </nav>
  );
}
