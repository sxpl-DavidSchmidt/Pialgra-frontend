export function studyMinutesByDay(sessions, daysDisplayed, now = new Date()) {
  const intervals = sessions
    .map(session => [new Date(session.startTime).getTime(), new Date(session.endTime).getTime()])
    .filter(([start, end]) => Number.isFinite(start) && Number.isFinite(end) && end > start);

  return Array.from({ length: daysDisplayed }, (_, index) => {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysDisplayed + 1 + index);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);

    return intervals.reduce((minutes, [sessionStart, sessionEnd]) =>
      minutes + Math.max(0, Math.min(sessionEnd, end.getTime()) - Math.max(sessionStart, start.getTime())) / 60000, 0
    );
  });
}

export function sessionsOnDay(sessions, day) {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).getTime();
  return sessions.filter(session => {
    const sessionStart = new Date(session.startTime).getTime();
    const sessionEnd = new Date(session.endTime).getTime();
    return Number.isFinite(sessionStart) && Number.isFinite(sessionEnd)
      && sessionEnd > sessionStart && sessionStart < end && sessionEnd > start;
  });
}
