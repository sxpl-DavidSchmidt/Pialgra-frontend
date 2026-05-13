import styles from "./AccountForm.module.css";

export default function AccountForm({ options, topText, bottomText }) {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginForm}>
        <h1>{topText}</h1>
        {options.map((option) => {
          return <div className={styles.loginOption}>{option}</div>;
        })}
        {bottomText}
      </div>
    </div>
  );
}
