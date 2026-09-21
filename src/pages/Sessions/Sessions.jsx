import { useState } from "react";
import StudyActivityCalendar from "../../components/TimeTableSummary/StudyActivityCalendar";
import { sessionsOnDay } from "../../components/TimeTableSummary/studyActivity";
import { useStudySessions } from "../../context/useStudySessions";

import styles from "./Sessions.module.css";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent.jsx";
import SessionComponent from "../../components/StudySessionComponent/StudySessionComponent.jsx";

import ArrowIcon from "../../assets/icons/arrow_up.svg?react";

export default function Sessions() {
    const { studySessions, categories } = useStudySessions();
    const [selectedDay, setSelectedDay] = useState(() => new Date());
    const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const monthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
    const visibleSessions = sessionsOnDay(studySessions, selectedDay);

    function changeMonth(offset) {
        setVisibleMonth(month => new Date(month.getFullYear(), month.getMonth() + offset, 1));
    }

    return (
        <div className={styles.content}>
            <div className={styles.categoryWrapper}>
                <h2>Your Categories</h2>
                <div className={styles.categoryList}>
                    {categories.map(category => <CategoryComponent key={category.uuid} category={category} />)}
                </div>
            </div>
            <div className={styles.sessionWrapper}>
                <div className={styles.daySelectionWrapper}>
                    <center><h2>Select a day</h2></center>
                    <div className={styles.monthNavigation}>
                        <button type="button" onClick={() => changeMonth(-1)}><ArrowIcon className={styles.arrowIcon} style={{ transform: "rotate(-90deg)" }} /></button>
                        <div className={styles.monthLabel}>
                            <h3>{visibleMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h3>
                        </div>
                        <button type="button" onClick={() => changeMonth(1)}><ArrowIcon className={styles.arrowIcon} style={{ transform: "rotate(90deg)" }} /></button>
                    </div>
                    <StudyActivityCalendar
                        sessions={studySessions}
                        daysDisplayed={monthEnd.getDate()}
                        endDate={monthEnd}
                        selectedDay={selectedDay}
                        onSelectDay={setSelectedDay}
                    />
                </div>
                <div className={styles.sessionsPanel}>
                    <center><h2>Your Sessions</h2></center>
                    <center><p>{selectedDay.toLocaleDateString(undefined, { dateStyle: "full" })}</p></center>
                    <div className={styles.sessionsList} tabIndex={0}>
                        {visibleSessions.length === 0 && <p className={styles.emptyState}>No sessions for this day.</p>}
                        {visibleSessions.map((value) => {
                            return (
                                <SessionComponent key={value.uuid} session={value} />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div >
    );
}
