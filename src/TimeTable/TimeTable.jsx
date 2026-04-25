import styles from "./TimeTable.module.css";

function TimeTable({
    year,
    month,
    workedHours = [],
    color = "#000000",
    cellSize = 24,
    onlyTable = false,
    subjectName,
}) {
    const monthDays = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const hoursForMonth = workedHours.slice(0, monthDays);

    const paddedWorkedHours = [...Array(firstWeekday).fill(null), ...hoursForMonth];
    const maxHours = Math.max(...hoursForMonth, 0);

    const hexColor = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#000000";
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const rows = Math.ceil(paddedWorkedHours.length / 7);

    const table = <div
        className={styles.activityTable}
        style={{
            gridTemplateColumns: `repeat(7, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
    >
        {paddedWorkedHours.map((hours, index) =>
            hours === null ? (
                <div key={`empty-${index}`} aria-hidden="true" />
            ) : (
                <div
                    key={`day-${index - firstWeekday + 1}`}
                    className={styles.activityCell}
                    title={`${hours} worked hour${hours === 1 ? "" : "s"}`}
                    style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: `rgba(${r}, ${g}, ${b}, ${maxHours > 0 ? hours / maxHours : 0
                            })`,
                    }}
                />
            )
        )}
    </div>

    if (onlyTable) {
        return table;
    }

    return (
        <div
            className={styles.activityCard}
            style={{ maxWidth: cellSize * 7 + 20 }}
        >
            <h3>{subjectName}</h3>
            {table}
        </div>
    );
}

export default TimeTable;