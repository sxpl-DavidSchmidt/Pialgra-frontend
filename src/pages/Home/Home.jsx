import styles from "./Home.module.css";

import Timer from "../../components/Timer/Timer.jsx";
import TimeTableSummary from "../../components/TimeTableSummary/TimeTableSummary.jsx";

function generateHours(days, maxValue) {
  return Array.from({ length: days }, () =>
    Math.floor(Math.random() * (maxValue + 1)),
  );
}

export default function Home() {
  const year = 2026;
  const month = 2;

  return (
    <div className={styles.content}>
      <TimeTableSummary workedHours={generateHours(45, 7)}/>
      <div className={styles.sessionOverview}>
        <Timer />
      </div>
    </div>
  );
}
