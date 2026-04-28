import styles from "./SubjectSummary.module.css";
import TimeTable from "../TimeTable/TimeTable";

export default function SubjectSummary({ name, sessions = [] }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.titlePanel}>
        <img
          alt="Subject Image"
          src="https://images.icon-icons.com/1808/PNG/512/computer_115306.png"
        />
        <h2>{name}</h2>
      </div>
    </div>
  );
}
