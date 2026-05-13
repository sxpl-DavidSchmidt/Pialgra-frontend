import styles from "./Signup.module.css";

import Logo from "../../assets/logo/pialgra_logo_notext.svg";
import PersonIcon from "../../assets/icons/person.svg?react";
import MailIcon from "../../assets/icons/mail.svg?react";
import KeyIcon from "../../assets/icons/key.svg?react";

import AccountForm from "../../components/AccountForm/AccountForm";

export default function Signup() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AccountForm
          topText="Sign-Up"
          bottomText={
            <p>
              Already have an account?{" "}
              <a href="/login" style={{ color: "var(--color-primary)" }}>
                Log in
              </a>
              !
            </p>
          }
          options={[
            <>
              <label for="username-input">
                <PersonIcon/>
              </label>
              <input type="text" placeholder="Username" id="username-input" />
            </>,
            <>
              <label for="email-input">
                <MailIcon />
              </label>
              <input type="email" placeholder="Email" id="username-input" />
            </>,
            <>
              <label for="password-input">
                <KeyIcon />
              </label>
              <input
                type="password"
                placeholder="Password"
                id="password-input"
              />
            </>,
            <>
              <label for="repeat-password-input">
                <KeyIcon />
              </label>
              <input
                type="password"
                placeholder="Repeat Password"
                id="repeat-password-input"
              />
            </>,
          ]}
        />
        <img src={Logo} />
      </div>
    </div>
  );
}
