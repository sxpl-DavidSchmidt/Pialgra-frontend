import React, { useEffect, useRef, useState } from "react";

import { useStudySessions } from "../../context/StudySessionContext.jsx";
import { createStudySession } from "../../api/studySessions";
import { getMyCategories } from "../../api/categories";

import styles from "./Timer.module.css";

import ArrowIcon from "../../assets/icons/arrow_down.svg?react";
import PauseIcon from "../../assets/icons/pause.svg?react";
import PlayIcon from "../../assets/icons/play.svg?react";
import ResetIcon from "../../assets/icons/reset.svg?react";

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;

export default function Timer() {
  const { refreshStudySessions } = useStudySessions();

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const workDurationMs = WORK_MINUTES * MS_PER_MINUTE;
  const progress = Math.min(elapsedTime / workDurationMs, 1);
  const outerDashOffset = 1 - progress;

  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);
  const sessionStartTimeRef = useRef(null);

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

  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await getMyCategories();

        setCategories(categories);

        if (categories.length > 0) {
          setSelectedCategory(categories[0].uuid);
        }
      } catch (error) {
        console.error("Could not load categories:", error);
      }
    }

    loadCategories();
  }, []);

  const toggleRunning = async () => {
    if (isRunning) {
      const endTime = new Date();

      setIsRunning(false);

      try {
        await createStudySession(
          selectedCategory,
          sessionStartTimeRef.current.toISOString(),
          endTime.toISOString()
        );

        await refreshStudySessions();

        setElapsedTime(0);
        sessionStartTimeRef.current = null;
      } catch (error) {
        console.error("Could not save study session:", error);
      }

      return;
    }

    sessionStartTimeRef.current = new Date();
    startTimeRef.current = Date.now();

    setIsRunning(true);
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsRunning(false);
    sessionStartTimeRef.current = null;
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
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option
              key={category.uuid}
              value={category.uuid}
            >
              {category.name}
            </option>
          ))}
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
