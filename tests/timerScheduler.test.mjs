import test from "node:test";
import assert from "node:assert/strict";
import { watchStudyTimer } from "../src/context/timerScheduler.js";

function setup() {
  const clock = new EventTarget();
  const documentTarget = new EventTarget();
  let time = 1000;
  let saves = 0;
  let elapsed = 0;
  let interval;
  let timeout;
  let delay;
  clock.setInterval = callback => { interval = callback; return 1; };
  clock.setTimeout = (callback, ms) => { timeout = callback; delay = ms; return 2; };
  clock.clearInterval = () => { interval = null; };
  clock.clearTimeout = () => { timeout = null; };
  const stop = watchStudyTimer({ startTime: time, duration: 25 * 60000, clock, documentTarget,
    now: () => time, onComplete: () => saves++, onElapsed: value => { elapsed = value; } });
  return { clock, documentTarget, stop, advance: ms => { time += ms; }, tick: () => interval?.(),
    deadline: () => timeout?.(), get saves() { return saves; }, get elapsed() { return elapsed; }, get delay() { return delay; } };
}

test("25-minute deadline completes once even without display ticks", () => {
  const timer = setup();
  assert.equal(timer.delay, 1500000);
  timer.advance(1499999);
  timer.tick();
  assert.equal(timer.saves, 0);
  assert.equal(timer.elapsed, 1499999);
  timer.advance(1);
  timer.deadline();
  timer.tick();
  timer.clock.dispatchEvent(new Event("focus"));
  assert.equal(timer.saves, 1);
  timer.stop();
});

for (const event of ["visibilitychange", "focus", "pageshow"]) {
  test(`overdue timer completes on ${event} after browser suspension`, () => {
    const timer = setup();
    timer.advance(30 * 60000);
    (event === "visibilitychange" ? timer.documentTarget : timer.clock).dispatchEvent(new Event(event));
    timer.deadline();
    assert.equal(timer.saves, 1);
    timer.stop();
  });
}

test("stopped or unmounted timer cannot auto-save later", () => {
  const timer = setup();
  timer.stop();
  timer.advance(30 * 60000);
  timer.tick();
  timer.deadline();
  timer.clock.dispatchEvent(new Event("focus"));
  timer.documentTarget.dispatchEvent(new Event("visibilitychange"));
  assert.equal(timer.saves, 0);
});
