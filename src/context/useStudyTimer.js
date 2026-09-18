import { createContext, useContext } from "react";

export const StudyTimerContext = createContext(null);

export function useStudyTimer() {
  const timer = useContext(StudyTimerContext);
  if (!timer) throw new Error("useStudyTimer must be used inside StudyTimerProvider");
  return timer;
}
