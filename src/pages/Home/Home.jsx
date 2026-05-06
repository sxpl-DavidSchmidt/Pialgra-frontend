import styles from "./Home.module.css";

import TimeTable from "../../components/TimeTable/TimeTable.jsx";
import Timer from "../../components/Timer/Timer.jsx";

function generateHours(days, maxValue) {
  return Array.from({ length: days }, () =>
    Math.floor(Math.random() * maxValue + 1),
  );
}

export default function Home() {
  const year = 2026;
  const month = 2;

  return (
    <div className={styles.content}>
      <div className={styles.subjectDisplay}>
        <TimeTable
          subjectName="Computer Science"
          workedHours={generateHours(30, 5)}
          timeFrameDays={30}
          color="#000000"
        />

        <TimeTable
          subjectName="Algebra"
          workedHours={generateHours(30, 5)}
          timeFrameDays={30}
          color="#0262bd"
        />

        <TimeTable
          subjectName="Psychology"
          workedHours={generateHours(30, 5)}
          timeFrameDays={30}
          color="#ff0095"
        />

        <TimeTable
          subjectName="English"
          workedHours={generateHours(30, 5)}
          timeFrameDays={30}
          color="#c70303"
        />

        <TimeTable
          subjectName="Literature"
          workedHours={generateHours(30, 5)}
          timeFrameDays={30}
          color="#018513"
        />
      </div>
      <div className={styles.sessionOverview}>
        <Timer />
      </div>
    </div>
  );
}
