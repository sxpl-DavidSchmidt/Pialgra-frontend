import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMyStudySessions } from "../api/studySessions";

const StudySessionsContext = createContext(null);

export function StudySessionsProvider({ children }) {
  const [studySessions, setStudySessions] = useState([]);

  async function refreshStudySessions() {
    try {
      const sessions = await getMyStudySessions();
      setStudySessions(sessions);
    } catch (error) {
      console.error("Could not load study sessions:", error);
    }
  }

  useEffect(() => {
    refreshStudySessions();
  }, []);

  return (
    <StudySessionsContext.Provider
      value={{
        studySessions,
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