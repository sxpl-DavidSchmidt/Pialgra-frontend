import styles from "./TimeTable.module.css";

function TimeTable(props) {
    const monthDays = new Date(props.year, props.month + 1, 0).getDate();
    const weekDay = new Date(props.year, props.month, 0).getDay();
    const maxHours = Math.max(...props.workedHours);
    const paddedWorkedHours = Array(weekDay).fill(null).concat(props.workedHours);

    const r = parseInt(props.color.slice(1, 3), 16);
    const g = parseInt(props.color.slice(3, 5), 16);
    const b = parseInt(props.color.slice(5, 7), 16);

    return (
        <div
            className={styles.activityCard}
            style={{
                maxWidth: `${props.cellSize*7 + 20}px`
            }}
        >
            <h3>{props.subjectName}</h3>
            <div
                className={styles.activityTable}
                style={{
                    gridTemplateColumns: `repeat(7, ${props.cellSize}px)`,
                    gridTemplateRows: `repeat(${Math.ceil(monthDays / 7)}, ${props.cellSize}px)`,
                }}
            >
                {paddedWorkedHours.map((hours, index) => (
                    hours == null ? (
                        <div key={index}/>
                    ) : (
                    <div
                        key={index}
                        className={styles.activityCell}
                        style={{
                            width: `${props.cellSize}px`,
                            height: `${props.cellSize}px`,
                            backgroundColor: `rgba(${r}, ${g}, ${b}, ${hours / maxHours})`
                        }}
                    />
                )))}
            </div>
        </div>
    );
}

export default TimeTable; 