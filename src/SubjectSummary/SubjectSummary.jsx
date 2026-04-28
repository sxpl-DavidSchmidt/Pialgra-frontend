import styles from './SubjectSummary.module.css';
import TimeTable from '../TimeTable/TimeTable';

export default function SubjectSummary({ subject }) {
    const name = subject?.name || "Unknown Subject";
    const sessions = subject?.sessions || [];

    return (
        <div className={styles.wrapper}>
            <div className={styles.titlePanel}>
                <img alt="Subject Image" src="https://images.icon-icons.com/1808/PNG/512/computer_115306.png" />
                <h2>{name}</h2>
            </div>
            <div className={styles.components}>
                <TimeTable
                    year={2026}
                    month={0}
                    workedHours={sessions}
                    color="#000000"
                    cellSize={15}
                    subjectName={name}
                    onlyTable={true}
                />
            </div>
        </div>
    );
}
