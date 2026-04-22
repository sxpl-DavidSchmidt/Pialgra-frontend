import styles from "./SubjectCard.module.css";

function SubjectCard() {
    return(
        <div className={styles.subjectCard}>
            <h2 className={styles.subjectName}>Computer Science</h2>
            <img alt="profile picture" src="https://avatars.githubusercontent.com/u/62205605?v=4" className={styles.subjectImage}/>
        </div>
    );
}

export default SubjectCard