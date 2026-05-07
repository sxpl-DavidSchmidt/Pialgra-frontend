import styles from "./TimeTableSummary.module.css"

export default function TimeTableSummary({
    workedHours = [],
    cellSize = 10,
    color = "#000"
}) {
    const frameStart = new Date();
    frameStart.setDate(frameStart.getDate() - (30 - 1));
    const firstWeekday = frameStart.getDay();
    const adjHours = [
        ...Array(firstWeekday).fill(null),
        ...workedHours.slice(-30),
    ];

    console.log(adjHours);

    return (
        <div className={styles.container}>
            <h2>Study activity</h2>

            <div className={styles.timeSpentContainer}>
                <div className={styles.timeSpentItem}>
                    <h3>Total Time (30 days)</h3>
                    <h1 style={{
                        color: "var(--color-primary)"
                    }}>40h</h1>
                </div>
                <div className={styles.timeSpentItem}>
                    <h3>Daily Average</h3>
                    <h1 style={{ color: "var(--color-contrast-secondary)" }}>65m</h1>
                </div>
            </div>

            <div className={styles.timeTableContainer}>
                <h3>Last 30 Days</h3>
                <div className={styles.timeTable}>
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label, index) => {
                        return <div key={`label-${index}`} className={styles.weekdayLabel}>
                            {label}
                        </div>
                    })}

                    {adjHours.map((hours, index) => {
                        if (hours === null) return <div />
                        return (
                            <div
                                key={`cell-${index}`}
                                className={styles.timeTableCell}
                                title={`${hours} hour${hours === 1 ? "" : "s"}`}
                                style={{
                                    animationDelay: (Math.floor(index / 7) + index % 7) * 0.1 + "s",
                                    opacity: hours / Math.max(...workedHours),
                                    "--alpha": hours / Math.max(...workedHours),
                                }}
                            />
                        );
                    })}
                </div>

                <div className={styles.timeTableScaleContainer}>
                    <p>Less</p>
                    <div className={styles.timeTableScale}>
                        {[1, 2, 3, 4].map((value, index) => {
                            return <div
                                key={`scale-${index}`}
                                className={styles.timeTableCell}
                                style={{
                                    animationDelay: index * (7 / 4) * 0.1 + "s",
                                    opacity: value / 4,
                                    "--alpha": value / 4,
                                }}
                            />
                        })}
                    </div>
                    <p>More</p>
                </div>
            </div>

            <div className={styles.sessionsContainer}>
                <h3>Recent Sessions</h3>
                <div className={styles.sessionsList}>
                    {[["May 5", 138], ["May 4", 98]].map((value, index) => {
                        const cDate = value[0];
                        const cTime = value[1];
                        return (
                            <div className={styles.sessionsItem}>
                                <p>{cDate}</p>
                                <p style={{fontWeight: `bold`}}>{cTime}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}