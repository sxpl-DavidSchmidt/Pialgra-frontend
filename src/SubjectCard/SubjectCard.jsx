import styles from "./SubjectCard.module.css";

export default function SubjectCard({ subjectName, imageSrc }) {
  return (
    <div className={styles.subjectCard}>
      <h2 className={styles.subjectName}>{subjectName}</h2>
      <img
        src={imageSrc}
        alt={`${subjectName} illustration`}
        className={styles.subjectImage}
        loading="lazy"
      />
    </div>
  );
}
