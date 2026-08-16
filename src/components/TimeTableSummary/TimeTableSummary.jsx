import styles from "./TimeTableSummary.module.css"

function parseStudySessions(studySessions, daysDisplayed) {
    if (!studySessions || studySessions.length === 0) return [];

    function getSessionDurationMinutes(session) {
        return (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60);
    }

    const minutesPerDay = new Map();
    for (const session of studySessions) {
        const sessionDate = new Date(session.endTime).toDateString();
        if (!minutesPerDay.has(sessionDate)) { minutesPerDay.set(sessionDate, 0); }
        minutesPerDay.set(sessionDate, minutesPerDay.get(sessionDate) + getSessionDurationMinutes(session));
    }

    const workedMinutes = new Array(daysDisplayed).fill(0);
    const today = new Date();
    for (const [date, minutes] of minutesPerDay) {
        let daysAgo = Math.floor((today - new Date(date)) / (1000 * 60 * 60 * 24));
        if (daysAgo > daysDisplayed || daysAgo < 0) continue;
        else {
            workedMinutes[daysDisplayed - 1 - daysAgo] = minutes;
        }
    }

    return workedMinutes;
}

export default function TimeTableSummary({ sessions = [], daysDisplayed = 30 }) {
    const workedHours = parseStudySessions(sessions, daysDisplayed).map(minutes => minutes / 60);

    const frameStart = new Date();
    frameStart.setDate(frameStart.getDate() - (daysDisplayed - 1));
    const firstWeekday = frameStart.getDay();
    const adjHours = [
        ...Array(firstWeekday).fill(null),
        ...workedHours.slice(-daysDisplayed),
    ];

    const maxHours = Math.max(...adjHours);
    const totalHours = adjHours.reduce((partialSum, a) => partialSum + a, 0);
    const averageHours = (totalHours / daysDisplayed).toString().substring(0, 4);

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
                    <h1 style={{ color: "var(--color-contrast-secondary)" }}>{averageHours}h</h1>
                </div>
            </div>

            <div className={styles.timeTableContainer}>
                <h3>Activity Summary</h3>
                <div className={styles.timeTable}>
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label, index) => {
                        return <div key={`label-${index}`} className={styles.weekdayLabel}>{label}</div>
                    })}

                    {adjHours.map((hours, index) => {
                        let cell = (hours === null || hours === 0) ?
                            <div
                                className={styles.timeTableCellEmpty}
                            /> :
                            <div
                                className={styles.timeTableCellContent}
                                style={{
                                    animationDelay: (Math.floor(index / 7) + index % 7) * 0.1 + "s",
                                    opacity: hours / Math.max(...workedHours),
                                    "--alpha": hours / Math.max(...workedHours),
                                }}
                            />;

                        return (
                            <div
                                key={`cell-${index}`}
                                className={styles.timeTableCell}
                                title={`${hours} hour${hours === 1 ? "" : "s"}`}
                                style={{ animationDelay: (Math.floor(index / 7) + index % 7) * 0.1 + "s" }}
                            >
                                {cell}
                            </div>
                        );
                    })}
                </div>

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