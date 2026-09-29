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
    const activeDays = workedMinutes.filter(minutes => minutes > 0).length;
    const averageMinutes = activeDays > 0 ? totalMinutes / activeDays : 0;
    const todayMinutes = workedMinutes.at(-1) ?? 0;

    return (
        <div className={styles.container}>
            <div>
                <h1>Study activity</h1>
                <h3>Last {daysDisplayed} days</h3>
            </div>

            <div>
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

            <div className={styles.timeSpentContainer}>
                <div className={styles.timeSpentItem}>
                    <h4>Daily Average</h4>
                    <h2>{formatTime(averageMinutes)} min</h2>
                </div>

                <div className={styles.timeSpentItem}>
                    <h4>Time Today</h4>
                    <h2>{formatTime(todayMinutes)} min</h2>
                </div>
            </div>
        </div>
    );
}
