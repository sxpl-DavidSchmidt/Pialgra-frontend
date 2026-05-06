import styles from "./TimerBar.module.css";

export default function TimerBar({
  name = null,
  primaryColor = null,
  secondaryColor = null,
}) {
  const timer = (
    <div className={styles.timer}>
      <h2>15:00</h2>
      <svg className={styles.timerSvg} viewBox="0 0 300 80">
        <line
          x1={40}
          y1={40}
          x2={260}
          y2={40}
          stroke={secondaryColor === null ? "#d1d5db" : secondaryColor}
          stroke-width={60}
          stroke-linecap="round"
        />

        <line
          x1={40}
          y1={40}
          x2={180}
          y2={40}
          stroke={primaryColor === null ? "#2563eb" : primaryColor}
          stroke-width={40}
          stroke-linecap="round"
        />
      </svg>
    </div>
  );

  if (name === null) return timer;
  return (
    <div className={styles.container}>
      <h1>{name}</h1>
    </div>
  );
}
