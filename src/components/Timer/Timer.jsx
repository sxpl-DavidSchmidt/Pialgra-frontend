import React, { useEffect, useRef, useState } from "react";

import styles from "./Timer.module.css";

import ArrowIcon from "../../assets/icons/arrow_down.svg?react";
import PauseIcon from "../../assets/icons/pause.svg?react";
import PlayIcon from "../../assets/icons/play.svg?react";
import ResetIcon from "../../assets/icons/reset.svg?react";

const WORK_MINUTES = 10;
const BREAK_MINUTES = 15;
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const workDurationMs = WORK_MINUTES * MS_PER_MINUTE;
  const progress = Math.min(elapsedTime / workDurationMs, 1);
  const outerDashOffset = 1 - progress;

  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    intervalIdRef.current = window.setInterval(() => {
      const now = Date.now();
      const nextElapsed = now - startTimeRef.current;

      if (nextElapsed >= workDurationMs) {
        setElapsedTime(workDurationMs);
        setIsRunning(false);
        return;
      }

      setElapsedTime(nextElapsed);
    }, 1000);

    return () => {
      if (intervalIdRef.current !== null) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isRunning, workDurationMs]);

  const toggleRunning = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    startTimeRef.current = Date.now() - elapsedTime;
    setIsRunning(true);
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsRunning(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(elapsedTime / MS_PER_MINUTE);
    const seconds = Math.floor((elapsedTime % MS_PER_MINUTE) / MS_PER_SECOND);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.clockContainer}>
        <div className={styles.clockText}>
          <h1>{formatTime()}</h1>
        </div>

        <div className={`${styles.timerNotice} ${isRunning ? styles.visible : styles.hidden}`}>
          {String(WORK_MINUTES).padStart(2, "0")}:{String(0).padStart(2, "0")}
        </div>

        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ rotate: "90deg" }}>
          <path
            className={styles.clockOuter}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            d="M 25, 100 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
          <path
            className={styles.clockInner}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeDasharray={1}
            strokeDashoffset={outerDashOffset}
            d="M 25, 100 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </svg>
      </div>

      <div className={styles.menu}>
        <select>
          <option>Computer Science</option>
          <option>Psychology</option>
        </select>

        <button
          type="button"
          onClick={toggleRunning}
          className={`${styles.startButton} ${isRunning ? styles.stopButton : ""}`}
        >
          {isRunning ? <PauseIcon className={styles.startButtonIcon} /> : <PlayIcon className={styles.startButtonIcon} />}
          <p>{isRunning ? "Stop" : "Start"}</p>
        </button>

        <button type="button" onClick={resetTimer} className={styles.resetButton}>
          <ResetIcon className={styles.resetButtonIcon} />
          <p>Reset</p>
        </button>

        <div className={styles.timeSelectWrap} style={{ gridArea: "workTimer" }}>
          <p>Work Duration</p>
          <div className={styles.timeSelect}>
            <button type="button">
              <ArrowIcon style={{ rotate: "90deg" }} />
            </button>
            <p>{WORK_MINUTES}m</p>
            <button type="button">
              <ArrowIcon style={{ rotate: "-90deg" }} />
            </button>
          </div>
        </div>

        <div className={styles.timeSelectWrap} style={{ gridArea: "breakTimer" }}>
          <p>Break Duration</p>
          <div className={styles.timeSelect}>
            <button type="button">
              <ArrowIcon style={{ rotate: "90deg" }} />
            </button>
            <p>{BREAK_MINUTES}m</p>
            <button type="button">
              <ArrowIcon style={{ rotate: "-90deg" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
