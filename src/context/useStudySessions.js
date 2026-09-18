import { createContext, useContext } from "react";
export const StudySessionsContext = createContext(null);
export function useStudySessions() {
  const context = useContext(StudySessionsContext);
  if (!context) throw new Error("useStudySessions must be used inside StudySessionsProvider");
  return context;
}
