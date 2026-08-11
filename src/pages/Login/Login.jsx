import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ApiError } from "../../api/api";

import styles from "./Login.module.css";

import Logo from "../../assets/logo/pialgra_logo_notext.svg";
import PersonIcon from "../../assets/icons/person.svg?react";
import KeyIcon from "../../assets/icons/key.svg?react";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p>Loading...</p>; // still checking /users/me
  if (user) return <Navigate to="/" replace />; // Already logged in

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Something went wrong");
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.loginWrapper}>
          <h1>Login</h1>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.loginOption}>
              <label htmlFor="username-input">
                <PersonIcon className={styles.loginOptionIcon} />
              </label>
              <input
                id="username-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.loginOption}>
              <label htmlFor="password-input">
                <KeyIcon className={styles.loginOptionIcon} />
              </label>
              <input
                id="password-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={styles.loginButton}
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p>Already have an account?{" "}<a href="/signup" style={{ color: "var(--color-primary)" }}>Sign up</a>!</p>
        </div>

        <img src={Logo} />
      </div>
    </div>
  );
}
