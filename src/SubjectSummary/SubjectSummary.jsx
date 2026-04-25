import styles from './SubjectSummary.module.css';
import computerImage from '../assets/computer.png';
import TimeTable from '../TimeTable/TimeTable';

function SubjectSummary({ subject }) {
    const name = subject?.name || "Unknown Subject";
    const sessions = subject?.sessions || [];

    return (
        <div className={styles.wrapper}>
            <div className={styles.titlePanel}>
                <img alt="Subject Image" src={computerImage} />
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

export default SubjectSummary;