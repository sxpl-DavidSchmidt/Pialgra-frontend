import { StudyTimerContext } from "./useStudyTimer";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStudySessions } from "./useStudySessions";
import { createStudySession } from "../api/studySessions";
import { createCategory } from "../api/categories";

export default function StudyTimerProvider({ children }) {
  const { categories, refreshStudySessions, loading } = useStudySessions();
  const [phase, setPhase] = useState("idle");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const session = useRef(null);
  const saving = useRef(false);
  const addingCategory = useRef(false);
  const isRunning = phase === "running";
  const workDurationMs = workMinutes * 60 * 1000;
  const categoryUuid = categories.some(category => category.uuid === selectedCategory) ? selectedCategory : categories[0]?.uuid || "";
  const outerDashOffset = 1 - Math.min(elapsedTime / workDurationMs, 1);

  const saveSession = useCallback(async () => {
    const current = session.current;
    if (!current || saving.current) return;
    saving.current = true;
    current.endTime ??= Math.min(Date.now(), current.startTime + current.duration);
    setElapsedTime(current.endTime - current.startTime);
    setPhase("saving");
    setError("");
    try {
      await createStudySession(current.categoryUuid, new Date(current.startTime).toISOString(), new Date(current.endTime).toISOString());
      session.current = null;
      setElapsedTime(0);
      setPhase("idle");
      await refreshStudySessions();
    } catch (error) {
      setPhase("pending");
      setError(`${error.message || "Could not save your session."} Retry saving before starting another session.`);
    } finally {
      saving.current = false;
    }
  }, [refreshStudySessions]);

  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      const current = session.current;
      if (!current) return;
      const elapsed = Date.now() - current.startTime;
      if (elapsed >= current.duration) {
        void saveSession();
      } else setElapsedTime(elapsed);
    };
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [isRunning, saveSession]);

  function handleCategorySelect(event) {
    if (event.target.value === "__new__") setShowAdd(true);
    else setSelectedCategory(event.target.value);
  }

  async function handleAddCategory() {
    const value = newCategory.trim();
    if (!value || addingCategory.current) return;
    addingCategory.current = true;
    setAdding(true);
    setError("");
    try {
      const category = await createCategory(value);
      setSelectedCategory(category.uuid);
      setNewCategory("");
      setShowAdd(false);
      await refreshStudySessions();
    } catch (error) {
      setError(error.message || "Could not create category.");
    } finally {
      setAdding(false);
      addingCategory.current = false;
    }
  }

  function toggleRunning() {
    if (phase === "running" || phase === "pending") { void saveSession(); return; }
    if (!categoryUuid || loading || saving.current) return;
    session.current = { categoryUuid, startTime: Date.now(), duration: workDurationMs };
    setError("");
    setElapsedTime(0);
    setPhase("running");
  }

  function resetTimer() {
    if (saving.current) return;
    session.current = null;
    setElapsedTime(0);
    setPhase("idle");
    setError("");
  }

  function formatTime() {
    const seconds = Math.floor(elapsedTime / 1000);
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }
  return <StudyTimerContext.Provider value={{ categories, loading, phase, isRunning, elapsedTime, workMinutes, setWorkMinutes, categoryUuid, outerDashOffset, newCategory, setNewCategory, showAdd, setShowAdd, adding, error, handleCategorySelect, handleAddCategory, toggleRunning, resetTimer, formatTime }}>{children}</StudyTimerContext.Provider>;
}

