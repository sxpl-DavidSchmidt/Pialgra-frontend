import StudyActivityCalendar from "./StudyActivityCalendar";
import { studyMinutesByDay } from "./studyActivity";
import styles from "./TimeTableSummary.module.css"

function formatTime(minutesIn) {
    const minutes = Math.floor(minutesIn);
    const seconds = Math.floor((minutesIn % 1) * 60);
    return `${minutes}:${seconds}`;
}

export default function TimeTableSummary({ sessions = [], daysDisplayed = 30 }) {
    const workedMinutes = studyMinutesByDay(sessions, daysDisplayed)
    const totalMinutes = workedMinutes.reduce((sum, minutes) => sum + minutes, 0);
    const averageMinutes = (totalMinutes / daysDisplayed).toFixed(2);

    return (
        <div className={styles.container}>
            <h2>Study activity - Minutes - Last {daysDisplayed} days</h2>

            <div className={styles.timeSpentContainer}>
                <div className={styles.timeSpentItem}>
                    <h3>Total Time</h3>
                    <h1 style={{ color: "var(--color-primary)" }}>{formatTime(totalMinutes)}</h1>
                </div>
                <div className={styles.timeSpentItem}>
                    <h3>Daily Average</h3>
                    <h1 style={{ color: "var(--color-contrast)" }}>{formatTime(averageMinutes)}</h1>
                </div>
            </div>

            <div className={styles.timeTableContainer}>
                <h3>Activity Summary</h3>
                <StudyActivityCalendar sessions={sessions} daysDisplayed={daysDisplayed} />

                <div className={styles.timeTableScaleContainer}>
                    <p>Less</p>
                    <div className={styles.timeTableScale}>
                        {[1, 2, 3, 4].map((value, index) => {
                            return (
                                <div
                                    key={`cell-${index}`}
                                    className={styles.timeTableCell}
                                    style={{ animationDelay: index * (7 / 4) * 0.1 + "s", boxShadow: null }}
                                >
                                    <div
                                        key={`cell-${index}`}
                                        className={styles.timeTableCellContent}
                                        style={{
                                            animationDelay: index * (7 / 4) * 0.1 + "s",
                                            opacity: value / 4,
                                            "--alpha": value / 4,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <p>More</p>
                </div>
            </div>
        </div>
    );
}