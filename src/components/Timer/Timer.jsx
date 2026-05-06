import TimerBar from "../TimerBar/TimerBar";
import styles from "./Timer.module.css";

export default function Timer() {
  return (
    <div className={styles.container}>
      <TimerBar />
    </div>
  );
}
