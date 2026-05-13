import styles from "./Login.module.css";

import Logo from "../../assets/logo/pialgra_logo_notext.svg";
import PersonIcon from "../../assets/icons/person.svg?react";
import KeyIcon from "../../assets/icons/key.svg?react";

import AccountForm from "../../components/AccountForm/AccountForm";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AccountForm
          topText="Login"
          bottomText={
            <p>
              Don't have an account yet?{" "}
              <a href="/signup" style={{ color: "var(--color-primary)" }}>
                Sign up
              </a>
              !
            </p>
          }
          options={[
            <>
              <label for="username-input">
                <PersonIcon className={styles.loginOptionIcon} />
              </label>
              <input type="text" placeholder="username" id="username-input" />
            </>,
            <>
              <label for="password-input">
                <KeyIcon className={styles.loginOptionIcon} />
              </label>
              <input
                type="password"
                placeholder="password"
                id="password-input"
              />
            </>,
          ]}
        />
        <img src={Logo} />
      </div>
    </div>
  );
}
