import React, { useEffect, useRef, useState } from "react";

import { useStudySessions } from "../../context/StudySessionContext.jsx";
import { getMyCategories } from "../../api/categories";

import styles from "./Clock.module.css";

import Timer from "../../components/Timer/Timer.jsx";
import TimeTableSummary from "../../components/TimeTableSummary/TimeTableSummary.jsx";

function parseStudySessions(studySessions, categories) {
  const today = new Date();

  return [...studySessions]
    .filter((session) => {
      const start = new Date(session.startTime);
      return (
        start.getFullYear() === today.getFullYear() &&
        start.getMonth() === today.getMonth() &&
        start.getDate() === today.getDate()
      );
    })
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
    .map((session) => {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);

      const timeMinutes = (end - start) / (1000 * 60);
      const category = categories.find(
        (category) => category.uuid === session.category.uuid
      );

      return [
        timeMinutes,
        category?.name ?? "Unknown"
      ];
    });
}

function formatTime(minutes) {
  const seconds = Math.floor(minutes * 60);
  const minutesPart = Math.floor(minutes);
  return `${minutesPart.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function Clock() {
  const [categories, setCategories] = useState([]);
  const { studySessions } = useStudySessions();

  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await getMyCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Could not load categories:", error);
      }
    }

    loadCategories();
  }, []);

  const sessionData = parseStudySessions(studySessions, categories);

  return (
    <div className={styles.content}>
      <div style={{ display: "grid", placeItems: "center" }}><TimeTableSummary sessions={studySessions} daysDisplayed={30} /></div>

      <div className={styles.timerWrapper}>
        <div style={{ width: "50%" }}><Timer /></div>
      </div>

      <div className={styles.sessionsWrapper}>
        <h2>Todays Sessions</h2>
        <div className={styles.sessions}>
          {sessionData.map(value => {
            return (
              <div className={styles.sessionItem}>
                <p>{formatTime(value[0])}</p>
                <p>{value[1]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
