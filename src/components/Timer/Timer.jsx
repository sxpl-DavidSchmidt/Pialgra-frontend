import styles from "./Timer.module.css";

import PlayIcon from "../../assets/play.svg?react"
import ResetIcon from "../../assets/reset.svg?react"

export default function Timer() {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <select>
          <option>Computer Science</option>
          <option>Psychology</option>
        </select>

        <button className={styles.startButton}>
          <PlayIcon className={styles.startButtonIcon} />
          <p>Start</p>
        </button>
        <button className={styles.resetButton}>
          <ResetIcon className={styles.resetButtonIcon} />
          <p>Reset</p>
        </button>
        
        <div className={styles.timeSelectWrap} style={{gridArea: "workTimer"}}>
          <p>Work Duration</p>
          <div className={styles.timeSelect}>
            <button>-</button>
            <p>{25}m</p>
            <button>+</button>
          </div>
        </div>

        <div className={styles.timeSelectWrap} style={{gridArea: "breakTimer"}}>
          <p>Break Duration</p>
          <div className={styles.timeSelect}>
            <button>-</button>
            <p>{5}m</p>
            <button>+</button>
          </div>
        </div>

      </div>
    </div>
  );
}
