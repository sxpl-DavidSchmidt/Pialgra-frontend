import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/useAuth";

import styles from "./Navbar.module.css";
import Logo from "../../assets/logo/pialgra_logo_notext.svg";

export default function NavBar() {
  const { user, loading, logout, profilePicture } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
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

      <Link to="/sessions">Sessions</Link>

      {!loading && (
        user ? (
          <>
            <Link
              to="/profile"
              title="Your profile"
              className={styles.profilePictureWrapper}
            ><img
                src={profilePicture}
                alt=""
                className={styles.profilePicture}
              />
            </Link>
            <button
              type="button"
              className={styles.accentLink}
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out…" : "Logout"}
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={styles.accentLink}
          >
            Login
          </Link>
        )
      )}
      {error && <p style={{ color: "white", padding: "0.5em" }}>{error}</p>}
    </nav>
  );
}
