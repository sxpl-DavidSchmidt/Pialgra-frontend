import styles from "./Sessions.module.css";
import WeeklyView from "./WeeklyView.jsx";

export default function Sessions() {
    return (
        <div className={styles.content}>
            <div className={styles.wrapper}>
                <h2>Your Sessions</h2>
                <div>
                    <WeeklyView />
                </div>
            </div>
        </div>
    );
}