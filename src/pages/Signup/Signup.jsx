import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { register } from "../../api/auth";
import { useAuth } from "../../auth/AuthContext";
import { ApiError } from "../../api/api";

import styles from "./Signup.module.css";

import Logo from "../../assets/logo/pialgra_logo_notext.svg";
import PersonIcon from "../../assets/icons/person.svg?react";
import KeyIcon from "../../assets/icons/key.svg?react";

export default function Signup() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await register(username, password);

      // Registration succeeded.
      // User can now log in.
      navigate("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setError("Username is already taken");
        } else if (error.status === 400) {
          setError("Invalid username or password");
        } else {
          setError("Registration failed");
        }
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
        <div className={styles.signupWrapper}>
          <h1>Sign Up</h1>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.signupOption}>
              <label htmlFor="username-input">
                <PersonIcon className={styles.signupOptionIcon} />
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

            <div className={styles.signupOption}>
              <label htmlFor="password-input">
                <KeyIcon className={styles.signupOptionIcon} />
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

            <div className={styles.signupOption}>
              <label htmlFor="password-confirmation-input">
                <KeyIcon className={styles.signupOptionIcon} />
              </label>
              <input
                id="password-confirmation-input"
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={styles.signupButton}
            >
              {submitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p>Already have an account?{" "}<a href="/login" style={{ color: "var(--color-primary)" }}>Log in</a>!</p>
        </div>

        <img src={Logo} />
      </div>
    </div>
  );
}