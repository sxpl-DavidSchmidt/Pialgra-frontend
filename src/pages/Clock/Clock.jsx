
import { useStudySessions } from "../../context/useStudySessions";

import styles from "./Clock.module.css";

import StudySessionComponent from "../../components/StudySessionComponent/StudySessionComponent.jsx";
import { sessionsOnDay, studyMinutesByDay } from "../../components/TimeTableSummary/studyActivity";

import Timer from "../../components/Timer/Timer.jsx";
import TimeTableSummary from "../../components/TimeTableSummary/TimeTableSummary.jsx";

export default function Clock() {
  const { studySessions, categories, error, loading, refreshStudySessions } = useStudySessions();
  const today = new Date();
  const todaysSessions = sessionsOnDay(studySessions, today)
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

  return (
    <div className={styles.content}>
      {error && <div>{error} <button onClick={refreshStudySessions} disabled={loading}>Retry</button></div>}
      <div style={{ display: "grid", placeItems: "center" }}><TimeTableSummary sessions={studySessions} daysDisplayed={30} /></div>

      <div className={styles.timerWrapper}>
        <div style={{ width: "min(100%, 360px)" }}><Timer /></div>
      </div>

      <div className={styles.sessionsWrapper}>
        <h2>Todays Sessions</h2>
        <div className={styles.sessions}>
          {todaysSessions.map(session => (
            <StudySessionComponent
              key={session.uuid}
              session={{ ...session, category: categories.find(category => category.uuid === session.category?.uuid) ?? session.category }}
              displayedMinutes={studyMinutesByDay([session], 1, today)[0]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
