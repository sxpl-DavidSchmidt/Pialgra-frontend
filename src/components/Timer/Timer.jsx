import styles from "./Timer.module.css";

import PlayIcon from "../../assets/play.svg?react"
import ResetIcon from "../../assets/reset.svg?react"
import ArrowIcon from "../../assets/arrow_down.svg?react"

export default function Timer() {
  return (
    <div className={styles.container}><div className={styles.contentWrapper}>
      <div className={styles.clockContainer}>
        <div className={styles.clockText}>
          <h1>45:00</h1>
        </div>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path className={styles.clockOuter}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            d="
            M 25, 100
            a 75,75 0 1,0 150,0
            a 75,75 0 1,0 -150,0
          "/>
          <path className={styles.clockInner}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            d="
            M 25, 100
            a 75,75 0 1,0 150,0
            a 75,75 0 1,0 -150,0
          "/>
        </svg>

      </div>

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

        <div className={styles.timeSelectWrap} style={{ gridArea: "workTimer" }}>
          <p>Work Duration</p>
          <div className={styles.timeSelect}>
            <button><ArrowIcon style={{ rotate: "90deg" }}/></button>
            <p>{45}m</p>
            <button><ArrowIcon style={{ rotate: "-90deg" }}/></button>
          </div>
        </div>

        <div className={styles.timeSelectWrap} style={{ gridArea: "breakTimer" }}>
          <p>Break Duration</p>
          <div className={styles.timeSelect}>
            <button><ArrowIcon style={{ rotate: "90deg" }}/></button>
            <p>{15}m</p>
            <button><ArrowIcon style={{ rotate: "-90deg" }}/></button>
            
          </div>
        </div>

      </div>
    </div></div>
  );
}
