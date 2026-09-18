import { useStudyTimer } from "../../context/useStudyTimer";
import styles from "./Timer.module.css";
import ArrowIcon from "../../assets/icons/arrow_down.svg?react";
import PauseIcon from "../../assets/icons/pause.svg?react";
import PlayIcon from "../../assets/icons/play.svg?react";
import ResetIcon from "../../assets/icons/reset.svg?react";

export default function Timer() {
  const { categories, loading, phase, isRunning, workMinutes, setWorkMinutes, categoryUuid, outerDashOffset, newCategory, setNewCategory, showAdd, setShowAdd, adding, error, handleCategorySelect, handleAddCategory, toggleRunning, resetTimer, formatTime, deleteTarget, setDeleteTarget, deleting, deleteMessage, requestCategoryDeletion, confirmCategoryDeletion } = useStudyTimer();
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
          <path
            className={styles.clockOuter}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            d="M 25, 100 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
          {outerDashOffset != 1 ?
            <path
              className={styles.clockInner}
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeDasharray={1}
              strokeDashoffset={outerDashOffset}
              d="M 25, 100 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            /> : null
          }
        </svg>
      </div>

      <div className={styles.menu}>
        <select
          value={categoryUuid}
          onChange={handleCategorySelect}
          aria-label="Study category" disabled={phase !== "idle" || loading || adding || deleting}
        >
          {!categories.length && <option value="">Select a category</option>}
          {categories.map((category) => (
            <option
              key={category.uuid}
              value={category.uuid}
            >
              {category.name}
            </option>
          ))}
          <option value="__new__">+ Add new Category</option>
        </select>

        <div className={styles.categoryActions}>
          {!deleteTarget ? <button type="button" className={styles.deleteCategory} onClick={requestCategoryDeletion}
            disabled={!categoryUuid || phase !== "idle" || loading || adding || deleting}>Delete category</button> :
            <div className={styles.deleteConfirmation} role="group" aria-label="Confirm category deletion">
              <p>Delete “{deleteTarget.name}”? Existing sessions will be kept without a category.</p>
              <div>
                <button type="button" className={styles.deleteCategory} onClick={confirmCategoryDeletion} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</button>
                <button type="button" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              </div>
            </div>}
          {deleteMessage && <p role="status">{deleteMessage}</p>}
        </div>

        {showAdd && (
          <div className={styles.addOverlay}>
            <div className={styles.addPopup}>
              <input
                autoFocus
                type="text"
                value={newCategory}
                placeholder="New category..." aria-label="New category name" maxLength={100} disabled={adding}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCategory();
                  if (e.key === "Escape") setShowAdd(false);
                }}
              />

              <button type="button" onClick={handleAddCategory} disabled={adding || !newCategory.trim()} className={styles.popupAddButton}>
                Add
              </button>

              <button type="button" onClick={() => setShowAdd(false)} disabled={adding} className={styles.popupCancelButton}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={toggleRunning} disabled={phase === "saving" || !categoryUuid || loading || deleting || Boolean(deleteTarget)}
          className={`${styles.startButton} ${isRunning ? styles.stopButton : ""}`}
        >
          {isRunning ? <PauseIcon className={styles.startButtonIcon} /> : <PlayIcon className={styles.startButtonIcon} />}
          <p>{phase === "saving" ? "Saving…" : phase === "pending" ? "Retry save" : isRunning ? "Stop" : "Start"}</p>
        </button>

        <button type="button" onClick={resetTimer} disabled={phase === "saving"} className={styles.resetButton}>
          <ResetIcon className={styles.resetButtonIcon} />
          <p>Reset</p>
        </button>

        <div className={styles.timeSelectWrap} style={{ gridArea: "workTimer" }}>
          <p>Work Duration</p>
          <div className={styles.timeSelect}>
            <button type="button" aria-label="Decrease work duration" disabled={phase !== "idle" || workMinutes <= 5} onClick={() => setWorkMinutes(value => value - 5)}>
              <ArrowIcon style={{ rotate: "90deg" }} />
            </button>
            <p>{workMinutes}m</p>
            <button type="button" aria-label="Increase work duration" disabled={phase !== "idle" || workMinutes >= 120} onClick={() => setWorkMinutes(value => value + 5)}>
              <ArrowIcon style={{ rotate: "-90deg" }} />
            </button>
          </div>
        </div>

        {error && <p role="alert" style={{ gridColumn: "1 / -1" }}>{error}</p>}
      </div>
    </div>
  );
}
