import styles from "./Login.module.css"

import Logo from "../../assets/logo/pialgra_logo_notext.svg"

import PersonIcon from "../../assets/icons/person.svg?react"
import KeyIcon from "../../assets/icons/key.svg?react"

export default function Login() {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <div className={styles.loginWrapper}>
                <div className={styles.loginForm}>
                <div className={styles.loginOption}>
                    <label for="username-input">
                        <PersonIcon fill="var(--color-primary)" />
                    </label>
                    <label>
                        <input type="text" placeholder="username" id="username-input" />
                    </label>
                </div>

                <div className={styles.loginOption}>
                    <label for="password-input">
                        <KeyIcon fill="var(--color-primary)" />
                    </label>
                    <labal>
                        <input type="password" placeholder="password" id="password-input" />
                    </labal>
                </div>

                <p>Don't have an account yet? <a href="/signup" style={{ color: "var(--color-primary)" }}>Sign up</a>!</p>
                </div>
            </div>
            <img src={Logo} />
            </div>
        </div>
    );
}