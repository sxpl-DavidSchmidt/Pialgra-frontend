
import { useStudySessions } from "../../context/useStudySessions";

import styles from "./Clock.module.css";

import Timer from "../../components/Timer/Timer.jsx";
import TimeTableSummary from "../../components/TimeTableSummary/TimeTableSummary.jsx";

function parseStudySessions(studySessions, categories) {
  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();

  return [...studySessions]
    .filter((session) => {
      const start = new Date(session.startTime).getTime();
      const end = new Date(session.endTime).getTime();
      return Number.isFinite(start) && Number.isFinite(end) && end > start && start < dayEnd && end > dayStart;
    })
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
    .map((session) => {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);

      const timeMinutes = (Math.min(end.getTime(), dayEnd) - Math.max(start.getTime(), dayStart)) / (1000 * 60);
      const category = categories.find(
        (category) => category.uuid === session.category?.uuid
      );

      return [
        timeMinutes,
        category?.name ?? session.category?.name ?? "Uncategorized"
      ];
    });
}

function formatTime(minutes) {
  const seconds = Math.floor(minutes * 60);
  const minutesPart = Math.floor(minutes);
  return `${minutesPart.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function Clock() {
  const { studySessions, categories, error, loading, refreshStudySessions } = useStudySessions();
  const sessionData = parseStudySessions(studySessions, categories);

  return (
    <div className={styles.content}>
      {error && <div role="alert">{error} <button onClick={refreshStudySessions} disabled={loading}>Retry</button></div>}
      <div style={{ display: "grid", placeItems: "center" }}><TimeTableSummary sessions={studySessions} daysDisplayed={30} /></div>

      <div className={styles.timerWrapper}>
        <div style={{ width: "min(100%, 360px)" }}><Timer /></div>
      </div>

      <div className={styles.sessionsWrapper}>
        <h2>Todays Sessions</h2>
        <div className={styles.sessions}>
          {sessionData.map((value, index) => {
            return (
              <div
                key={`session-${index}`}
                className={styles.sessionItem}
                style={{ backgroundColor: categories.find(category => category.name === value[1])?.color ?? "var(--color-gray-200)" }}
              >
                <p>{formatTime(value[0])}</p>
                <p>{value[1]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
