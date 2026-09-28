import { StudyTimerContext } from "./useStudyTimer";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStudySessions } from "./useStudySessions";
import { createStudySession } from "../api/studySessions";
import { createCategory, deleteCategory } from "../api/categories";
import { CATEGORY_COLORS } from "../components/Timer/categoryColors";
import { watchStudyTimer } from "./timerScheduler";
import sessionEndSound from "../assets/sounds/session_end.mp3";

export default function StudyTimerProvider({ children }) {
  const { categories, refreshStudySessions, loading, categoryDeleted } = useStudySessions();
  const [phase, setPhase] = useState("idle");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(5);
  const [volume, setVolume] = useState(() => {
    try {
      const stored = localStorage.getItem("sessionEndVolume");
      const value = stored === null ? 50 : Number(stored);
      return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 50;
    } catch {
      return 50;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0].value);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const deletingCategory = useRef(false);
  const session = useRef(null);
  const saving = useRef(false);
  const addingCategory = useRef(false);
  const sessionEndAudio = useRef(null);
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
    const audio = new Audio(sessionEndSound);
    audio.preload = "auto";
    sessionEndAudio.current = audio;
    return () => {
      audio.pause();
      sessionEndAudio.current = null;
    };
  }, []);

  useEffect(() => {
    if (sessionEndAudio.current) sessionEndAudio.current.volume = volume / 100;
    try {
      localStorage.setItem("sessionEndVolume", String(volume));
    } catch {
    }
  }, [volume]);

  useEffect(() => {
    if (!isRunning) return;
    const current = session.current;
    if (!current) return;
    return watchStudyTimer({
      startTime: current.startTime,
      duration: current.duration,
      onElapsed: setElapsedTime,
      onComplete: () => {
        const audio = sessionEndAudio.current;
        if (audio) {
          audio.currentTime = 0;
          void audio.play().catch(() => { });
        }
        void saveSession();
      },
    });
  }, [isRunning, saveSession]);

  function handleCategorySelect(event) {
    setDeleteTarget(null);
    setSelectedCategory(event.target.value);
  }

  function requestCategoryDeletion(targetUuid = categoryUuid) {
    if (phase !== "idle" || loading || adding || deletingCategory.current) return;
    setError("");
    setDeleteTarget(categories.find(category => category.uuid === targetUuid) ?? null);
  }

  async function confirmCategoryDeletion() {
    if (!deleteTarget || phase !== "idle" || deletingCategory.current) return;
    const uuid = deleteTarget.uuid;
    deletingCategory.current = true;
    setDeleting(true);
    setError("");
    try {
      await deleteCategory(uuid);
      categoryDeleted(uuid);
      setSelectedCategory("");
      setDeleteTarget(null);
      await refreshStudySessions();
    } catch (error) {
      setError(error.message || "Could not delete category. Please try again.");
    } finally {
      deletingCategory.current = false;
      setDeleting(false);
    }
  }

  async function handleAddCategory() {
    const value = newCategory.trim();
    if (!value || addingCategory.current || deletingCategory.current) return;
    addingCategory.current = true;
    setAdding(true);
    setError("");
    try {
      const category = await createCategory(value, newCategoryColor);
      setSelectedCategory(category.uuid);
      setNewCategory("");
      setNewCategoryColor(CATEGORY_COLORS[0].value);
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
    if (!categoryUuid || loading || saving.current || deletingCategory.current || deleteTarget) return;
    session.current = { categoryUuid, startTime: Date.now(), duration: workDurationMs };
    setError("");
    setElapsedTime(0);
    setPhase("running");
  }

  function formatTime() {
    const seconds = Math.floor(elapsedTime / 1000);
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }
  return <StudyTimerContext.Provider value={{ categories, loading, phase, isRunning, workMinutes, setWorkMinutes, volume, setVolume, categoryUuid, outerDashOffset, newCategory, setNewCategory, newCategoryColor, setNewCategoryColor, showAdd, setShowAdd, adding, error, handleCategorySelect, handleAddCategory, toggleRunning, formatTime, deleteTarget, setDeleteTarget, deleting, requestCategoryDeletion, confirmCategoryDeletion }}>{children}</StudyTimerContext.Provider>;
}

