import TimerBar from "../TimerBar/TimerBar";
import styles from "./Timer.module.css";

export default function Timer() {
  return (
    <div className={styles.container}>
      <h1>Take a break!</h1>
      <TimerBar timeMinutes={45} primaryColor={"#F5A65B"} />
      <TimerBar timeMinutes={15} primaryColor={"#3D3522"} />
    </div>
  );
}
