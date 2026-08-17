import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMyStudySessions } from "../api/studySessions";
import { getMyCategories } from "../api/categories";

const StudySessionsContext = createContext(null);

export function StudySessionsProvider({ children }) {
  const [studySessions, setStudySessions] = useState([]);
  const [categories, setCategories] = useState([]);

  async function refreshStudySessions() {
    try {
      const sessions = await getMyStudySessions();
      setStudySessions(sessions);

      const categories = await getMyCategories();
      setCategories(categories)
    } catch (error) {
      console.error("Could not load study sessions or categories:", error);
    }
  }

  useEffect(() => {
    refreshStudySessions();
  }, []);

  return (
    <StudySessionsContext.Provider
      value={{
        studySessions,
        categories,
        refreshStudySessions,
      }}
    >
      {children}
    </StudySessionsContext.Provider>
  );
}

export function useStudySessions() {
  const context = useContext(StudySessionsContext);

  if (!context) {
    throw new Error(
      "useStudySessions must be used inside StudySessionsProvider"
    );
  }

  return context;
}