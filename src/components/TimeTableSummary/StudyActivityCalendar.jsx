import { studyMinutesByDay } from "./studyActivity";
import styles from "./TimeTableSummary.module.css";

export default function StudyActivityCalendar({
    sessions = [], daysDisplayed = 30, endDate = new Date(), selectedDay, onSelectDay,
}) {
    const hoursByDay = studyMinutesByDay(sessions, daysDisplayed, endDate).map(minutes => minutes / 60);
    const firstDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - daysDisplayed + 1);
    const maxHours = Math.max(1, ...hoursByDay);

    return (
        <div className={styles.timeTable}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(label => (
                <div key={label} className={styles.weekdayLabel}>{label}</div>
            ))}
            {Array.from({ length: firstDay.getDay() }, (_, index) => <div key={`padding-${index}`} aria-hidden="true" />)}
            {hoursByDay.map((hours, index) => {
                const day = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + index);
                const selected = selectedDay?.toDateString() === day.toDateString();
                const label = `${day.toLocaleDateString(undefined, { dateStyle: "full" })}: ${hours.toFixed(2)} hours`;
                const content = <>
                    <span className={hours ? styles.timeTableCellContent : styles.timeTableCellEmpty}
                        style={{ opacity: hours / maxHours, "--alpha": hours / maxHours }} />
                    {onSelectDay && <span className={styles.dayNumber}>{day.getDate()}</span>}
                </>;

                return onSelectDay ? (
                    <button key={day.toDateString()} type="button"
                        className={`${styles.timeTableCell} ${styles.dayButton} ${selected ? styles.selectedDay : ""}`}
                        title={label} aria-label={label} aria-pressed={selected}
                        aria-current={day.toDateString() === new Date().toDateString() ? "date" : undefined}
                        onClick={() => onSelectDay(day)}>
                        {content}
                    </button>
                ) : (
                    <div key={day.toDateString()} className={styles.timeTableCell} title={label}>
                        {content}
                    </div>
                );
            })}
        </div>
    );
}
