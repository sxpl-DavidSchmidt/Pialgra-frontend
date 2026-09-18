import { useCallback, useEffect, useRef, useState } from "react";
import { getMyStudySessions } from "../api/studySessions";
import { getMyCategories } from "../api/categories";
import { useAuth } from "../auth/useAuth";
import { StudySessionsContext } from "./useStudySessions";
import StudyTimerProvider from "./StudyTimerProvider";

const loadData = () => Promise.all([getMyStudySessions(), getMyCategories()]);

function StudySessionStore({ user, children }) {
  const [data, setData] = useState({ studySessions: [], categories: [] });
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState("");
  const request = useRef(0);

  const refreshStudySessions = useCallback(async () => {
    if (!user) return;
    const id = ++request.current;
    setLoading(true);
    try {
      const [studySessions, categories] = await loadData();
      if (id === request.current) {
        setData({ studySessions, categories });
        setError("");
      }
    } catch {
      if (id === request.current) setError("Could not load your study data. Please try again.");
    } finally {
      if (id === request.current) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const id = ++request.current;
    loadData().then(([studySessions, categories]) => {
      if (id === request.current) setData({ studySessions, categories });
    }).catch(() => {
      if (id === request.current) setError("Could not load your study data. Please try again.");
    }).finally(() => {
      if (id === request.current) setLoading(false);
    });
    return () => { request.current += 1; };
  }, [user]);

  return <StudySessionsContext.Provider value={{ ...data, loading, error, refreshStudySessions }}><StudyTimerProvider>{children}</StudyTimerProvider></StudySessionsContext.Provider>;
}

export function StudySessionsProvider({ children }) {
  const { user } = useAuth();
  return <StudySessionStore key={user?.username ?? "anonymous"} user={user}>{children}</StudySessionStore>;
}
