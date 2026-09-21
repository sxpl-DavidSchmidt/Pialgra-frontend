import StudyActivityCalendar from "./StudyActivityCalendar";
import { studyMinutesByDay } from "./studyActivity";
import styles from "./TimeTableSummary.module.css"

export default function TimeTableSummary({ sessions = [], daysDisplayed = 30 }) {
    const workedHours = studyMinutesByDay(sessions, daysDisplayed).map(minutes => minutes / 60);

    const totalHours = workedHours.reduce((sum, hours) => sum + hours, 0);
    const averageHours = (totalHours / daysDisplayed).toFixed(2);

    return (
        <div className={styles.container}>
            <h2>Study activity - Last {daysDisplayed} days</h2>

            <div className={styles.timeSpentContainer}>
                <div className={styles.timeSpentItem}>
                    <h3>Total Time</h3>
                    <h1 style={{ color: "var(--color-primary)" }}>{totalHours.toFixed(2)}h</h1>
                </div>
                <div className={styles.timeSpentItem}>
                    <h3>Daily Average</h3>
                    <h1 style={{ color: "var(--color-contrast)" }}>{averageHours}h</h1>
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