import React, { useState, useEffect, useRef } from "react";

import styles from "./Timer.module.css";

import PlayIcon from "../../assets/icons/play.svg?react"
import PauseIcon from "../../assets/icons/pause.svg?react"
import ResetIcon from "../../assets/icons/reset.svg?react"
import ArrowIcon from "../../assets/icons/arrow_down.svg?react"

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const workMinutes = 45;
  const workDurationMs = workMinutes * 60 * 1000;
  const progress = Math.min(elapsedTime / workDurationMs, 1);
  const outerDashOffset = 1 - progress;
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsed = now - startTimeRef.current;

        if (newElapsed >= workDurationMs) {
          setElapsedTime(workDurationMs);
          setIsRunning(false);
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          return;
        }

        setElapsedTime(newElapsed);
      }, 10);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isRunning, workDurationMs]);

  useEffect(() => {
    if (!isRunning) return;

    if (elapsedTime >= workDurationMs) {
      setElapsedTime(workDurationMs);
      setIsRunning(false);
    }
  }, [elapsedTime, isRunning, workDurationMs]);

  function toggleRunning() {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    startTimeRef.current = Date.now() - elapsedTime;
    setIsRunning(true);
  }

  function reset() {
    setElapsedTime(0);
    setIsRunning(false);
  }

  function formatTime() {
    let minutes = Math.floor(elapsedTime / (1000 * 60));
    let seconds = Math.floor(elapsedTime / (1000) % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.clockContainer}>
        <div className={styles.clockText}>
          <h1>{formatTime()}</h1>
        </div>

        <div className={`${styles.timerNotice} ${isRunning ? styles.visible : styles.hidden}`}>
          {String(workMinutes).padStart(2, "0")}:{String(0).padStart(2, "0")}
        </div>


        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ rotate: "90deg" }}>
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
            strokeDasharray={1}
            strokeDashoffset={outerDashOffset}
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

        <button
          onClick={toggleRunning}
          className={`${styles.startButton} ${isRunning ? styles.stopButton : ""}`}
        >
          {isRunning ? (
            <PauseIcon className={styles.startButtonIcon} />
          ) : (
            <PlayIcon className={styles.startButtonIcon} />
          )}
          <p>{isRunning ? "Stop" : "Start"}</p>
        </button>
        <button onClick={reset} className={styles.resetButton}>
          <ResetIcon className={styles.resetButtonIcon} />
          <p>Reset</p>
        </button>

        <div className={styles.timeSelectWrap} style={{ gridArea: "workTimer" }}>
          <p>Work Duration</p>
          <div className={styles.timeSelect}>
            <button><ArrowIcon style={{ rotate: "90deg" }} /></button>
            <p>{45}m</p>
            <button><ArrowIcon style={{ rotate: "-90deg" }} /></button>
          </div>
        </div>

        <div className={styles.timeSelectWrap} style={{ gridArea: "breakTimer" }}>
          <p>Break Duration</p>
          <div className={styles.timeSelect}>
            <button><ArrowIcon style={{ rotate: "90deg" }} /></button>
            <p>{15}m</p>
            <button><ArrowIcon style={{ rotate: "-90deg" }} /></button>

          </div>
        </div>

      </div>
    </div>
  );
}
