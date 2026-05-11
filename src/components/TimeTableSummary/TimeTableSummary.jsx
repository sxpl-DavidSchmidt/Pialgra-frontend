import styles from "./TimeTableSummary.module.css"

export default function TimeTableSummary({ workedHours = [], daysDisplayed = 30 }) {
    const frameStart = new Date();
    frameStart.setDate(frameStart.getDate() - (daysDisplayed - 1));
    const firstWeekday = frameStart.getDay();
    const adjHours = [
        ...Array(firstWeekday).fill(null),
        ...workedHours.slice(-daysDisplayed),
    ];

    const maxHours = Math.max(...adjHours);
    const totalHours = adjHours.reduce((partialSum, a) => partialSum + a, 0);
    const averageHours = (totalHours / daysDisplayed).toString().substring(0, 4)

    console.log(adjHours);

    return (
        <div className={styles.container}>
            <h2>Study activity</h2>

            <div className={styles.timeSpentContainer}>
                <div className={styles.timeSpentItem}>
                    <h3>Total Time ({daysDisplayed} days)</h3>
                    <h1 style={{ color: "var(--color-primary)" }}>{totalHours}h</h1>
                </div>
                <div className={styles.timeSpentItem}>
                    <h3>Daily Average</h3>
                    <h1 style={{ color: "var(--color-contrast-secondary)" }}>{averageHours}h</h1>
                </div>
            </div>

            <div className={styles.timeTableContainer}>
                <h3>Last 30 Days</h3>
                <div className={styles.timeTable}>
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label, index) => {
                        return <div key={`label-${index}`} className={styles.weekdayLabel}>{label}</div>
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
        </div>
    );
}