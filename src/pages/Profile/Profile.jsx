import { useRef, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import styles from "./Profile.module.css";
import Popup from "../../components/Popup/Popup";

import StudyActivityCalendar from "../../components/TimeTableSummary/StudyActivityCalendar";
import { sessionsOnDay } from "../../components/TimeTableSummary/studyActivity";
import { useStudySessions } from "../../context/useStudySessions";

import { useStudyTimer } from "../../context/useStudyTimer";
import AddCategoryPopup from "../../components/Timer/AddCategoryPopup";
import AddIcon from "../../assets/icons/add.svg?react";

import CategoryComponent from "../../components/CategoryComponent/CategoryComponent.jsx";
import SessionComponent from "../../components/StudySessionComponent/StudySessionComponent.jsx";

import ArrowIcon from "../../assets/icons/arrow_up.svg?react";

export default function Profile() {
  const { user, deleteAccount } = useAuth();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const deletePending = useRef(false);

  const { studySessions, categories } = useStudySessions();
  const { phase, loading, adding, deleting: deletingCategory, setShowAdd } = useStudyTimer();
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const monthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
  const visibleSessions = sessionsOnDay(studySessions, selectedDay);

  function changeMonth(offset) {
    setVisibleMonth(month => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }


  async function confirmDeletion() {
    if (deletePending.current) return;
    deletePending.current = true;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount();
    } catch {
      setDeleteError("Could not delete your account. Please try again.");
    } finally {
      deletePending.current = false;
      setDeleting(false);
    }
  }
  return (
    <section className={styles.container}>

      <div className={styles.card}>
        <h1>Your profile: {user.username}</h1>

        <div className={styles.categoryWrapper}>
          <h2>Your Categories</h2>
          <div className={styles.actions}>
            <button type="button" className={styles.addCategory}
              disabled={phase !== "idle" || loading || adding || deletingCategory}
              onClick={() => setShowAdd(true)}>
              <AddIcon />Add category
            </button>
          </div>
          <AddCategoryPopup />
          <div className={styles.categoryList}>
            {categories.map(category => <CategoryComponent key={category.uuid} category={category} />)}
          </div>
        </div>

        <div className={`${styles.actions} ${styles.accountActions}`}>
          <button type="button" className={styles.deleteAccount} onClick={() => { setDeleteError(""); setShowDelete(true); }}>
            Delete account
          </button>
        </div>

        {showDelete && (
          <Popup className={styles.deleteAccountPopup} title="Delete account?" busy={deleting} onCancel={() => setShowDelete(false)}>
            <p>Are you sure? Your account, categories, and history will be permanently deleted. This cannot be undone.</p>
            {deleteError && <p role="alert" className={styles.error}>{deleteError}</p>}
            <div className={styles.actions}>
              <button autoFocus type="button" className={styles.cancel} disabled={deleting} onClick={() => setShowDelete(false)}>Cancel</button>
              <button type="button" className={styles.deleteAccount} disabled={deleting} onClick={confirmDeletion}>
                {deleting ? "Deleting…" : "Delete account"}
              </button>
            </div>
          </Popup>
        )}
      </div>

      <div className={styles.sessions}>
        <h1 style={{ gridArea: "head" }}>Your Sessions</h1>

        <div className={styles.daySelectionWrapper}>
          <div className={styles.monthNavigation}>
            <button type="button" onClick={() => changeMonth(-1)}><ArrowIcon className={styles.arrowIcon} style={{ transform: "rotate(-90deg)" }} /></button>
            <h3>{visibleMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h3>
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
    </section>
  );
}
