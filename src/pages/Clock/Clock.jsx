import styles from "./Clock.module.css";

import Timer from "../../components/Timer/Timer.jsx";
import TimeTableSummary from "../../components/TimeTableSummary/TimeTableSummary.jsx";

function generateHours(days, maxValue) {
  return Array.from({ length: days }, () =>
    Math.floor(Math.random() * (maxValue + 1)),
  );
}

export default function Clock() {
  return (
    <div className={styles.content}>
      <TimeTableSummary workedHours={generateHours(30, 8)} daysDisplayed={30} />

      <div className={styles.mainContent}>
        <div style={{ width: "50%" }}>
          <Timer />
        </div>

        <div className={styles.sessionsWrapper}>
          <div>
            <h2>Time studied today</h2>
            <div className={styles.sessions}>
              <div className={styles.sessionItem}><p>45:50</p><p>Psychology</p></div>
              <div className={styles.sessionItem}><p>42:21</p><p>Computer Science</p></div>
            </div>
          </div>

          <div>
            <h2>Todays Sessions</h2>
            <div className={styles.sessions}>
              {[["45:50", "Pychology"], ["14:02", "Break"], ["42:21", "Computer Science"]].map(value => {
                const ps = <>
                  <p>{value[0]}</p>
                  <p>{value[1]}</p>
                </>
                if (value[1] == "Break") {
                  return (<div className={styles.sessionBreak}>{ps}</div>
                  )
                }
                return (
                  <div className={styles.sessionItem}>
                    <p>{value[0]}</p>
                    <p>{value[1]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
