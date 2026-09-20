import { useStudySessions } from "../../context/useStudySessions";

import styles from "./Sessions.module.css";
import SessionComponent from "../../components/StudySessionComponent/StudySessionComponent.jsx";

export default function Sessions() {
    const { studySessions, categories } = useStudySessions();

    return (
        <div className={styles.content}>
            <div className={styles.categoryWrapper}>
                <h2>Your Categories</h2>
                <div>
                    {categories.map((value, index) => {
                        return (
                            <div key={index} className={styles.category}>
                                {value.name}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.sessionWrapper}>
                <h2>Your Sessions</h2>
                <div>
                    {studySessions.map((value) => {
                        return (
                            <SessionComponent key={value.uuid} session={value} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
