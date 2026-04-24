import styles from "./SubjectCard.module.css";
import PropTypes from "prop-types";

function SubjectCard({ subjectName, imageSrc }) {
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

SubjectCard.propTypes = {
  subjectName: PropTypes.string.isRequired,
  imageSrc: PropTypes.string,
};

export default SubjectCard;