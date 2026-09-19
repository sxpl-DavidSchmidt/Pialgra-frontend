// Keep the display interval separate from the completion deadline. Browsers can
// suspend both in background tabs, so also check the deadline when returning.
export function watchStudyTimer({ startTime, duration, onElapsed, onComplete, clock = window, documentTarget = document, now = Date.now }) {
  let completed = false;
  const deadline = startTime + duration;
  const tick = () => {
    if (completed) return;
    const elapsed = Math.max(0, now() - startTime);
    if (now() >= deadline) {
      completed = true;
      onComplete();
    } else {
      onElapsed(elapsed);
    }
  };
  const interval = clock.setInterval(tick, 250);
  const timeout = clock.setTimeout(tick, Math.max(0, deadline - now()));
  clock.addEventListener("focus", tick);
  clock.addEventListener("pageshow", tick);
  documentTarget.addEventListener("visibilitychange", tick);
  tick();
  return () => {
    completed = true;
    clock.clearInterval(interval);
    clock.clearTimeout(timeout);
    clock.removeEventListener("focus", tick);
    clock.removeEventListener("pageshow", tick);
    documentTarget.removeEventListener("visibilitychange", tick);
  };
}
