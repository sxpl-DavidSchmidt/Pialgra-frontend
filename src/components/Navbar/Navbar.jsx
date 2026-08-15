import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getMyProfilePicture } from "../../api/user";

import styles from "./Navbar.module.css";
import Logo from "../../assets/logo/pialgra_logo_notext.svg";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const [profilePicture, setProfilePicture] = useState([]);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  useEffect(() => {
    async function fetchProfilePicture() {
      try {
        const profilePicture = await getMyProfilePicture();
        setProfilePicture(profilePicture)
      } catch (error) {
        console.error("Could not load profile picture:", error);
      }
    }

    fetchProfilePicture();
  }, []);

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
          <>
            <Link
              to="/profile"
              className={styles.profilePictureWrapper}
            ><img
                src={`data:image/png;base64,${profilePicture.imageData}`}
                className={styles.profilePicture}
              />
            </Link>
            <button
              type="button"
              className={styles.accentLink}
              onClick={handleLogout}
            >
              Logout
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
    </nav>
  );
}
