import styles from "./SubjectCard.module.css";
import PropTypes from 'prop-types';

function SubjectCard(props) {
    return(
        <div className={styles.subjectCard}>
            <h2 className={styles.subjectName}>{props.subjectName}</h2>
            <img alt="profile picture" src={props.imageSrc} className={styles.subjectImage}/>
        </div>
    );
}

SubjectCard.propTypes = {
    subjectName: PropTypes.string.isRequired,
    imageSrc: PropTypes.string
}

export default SubjectCard