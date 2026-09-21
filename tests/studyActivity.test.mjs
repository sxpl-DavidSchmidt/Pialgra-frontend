import test from 'node:test';
import assert from 'node:assert/strict';
import { studyMinutesByDay, sessionsOnDay } from '../src/components/TimeTableSummary/studyActivity.js';

test('empty history still contains every displayed day', () => {
  assert.deepEqual(studyMinutesByDay([], 3), [0, 0, 0]);
});

test('splits midnight sessions and excludes dates outside the window', () => {
  const now = new Date(2026, 8, 18, 12);
  const sessions = [
    { startTime: new Date(2026, 8, 17, 23, 30), endTime: new Date(2026, 8, 18, 0, 30) },
    { startTime: new Date(2026, 8, 15, 10), endTime: new Date(2026, 8, 15, 11) },
    { startTime: 'invalid', endTime: 'invalid' },
    { startTime: new Date(2026, 8, 18, 11), endTime: new Date(2026, 8, 18, 10) },
  ];
  assert.deepEqual(studyMinutesByDay(sessions, 3, now), [0, 30, 30]);
});

test('uses calendar days across daylight-saving changes', () => {
  const now = new Date(2026, 2, 30, 12);
  const start = new Date(2026, 2, 29);
  const end = new Date(2026, 2, 30);
  assert.deepEqual(studyMinutesByDay([{ startTime: start, endTime: end }], 2, now), [(end - start) / 60000, 0]);
});

test('day selection includes overlapping sessions but excludes midnight boundaries and invalid intervals', () => {
  const day = new Date(2026, 8, 18);
  const overnight = { startTime: new Date(2026, 8, 17, 23, 30), endTime: new Date(2026, 8, 18, 0, 30) };
  const daytime = { startTime: new Date(2026, 8, 18, 12), endTime: new Date(2026, 8, 18, 13) };
  const sessions = [
    overnight, daytime,
    { startTime: new Date(2026, 8, 17, 23), endTime: day },
    { startTime: new Date(2026, 8, 19), endTime: new Date(2026, 8, 19, 1) },
    { startTime: 'invalid', endTime: 'invalid' },
    { startTime: day, endTime: day },
    { startTime: daytime.endTime, endTime: daytime.startTime },
  ];
  assert.deepEqual(sessionsOnDay(sessions, day), [overnight, daytime]);
  assert.deepEqual(sessionsOnDay([], day), []);
});

test('day selection follows local calendar boundaries across daylight saving', () => {
  const day = new Date(2026, 2, 29);
  const session = { startTime: day, endTime: new Date(2026, 2, 30) };
  assert.deepEqual(sessionsOnDay([session], day), [session]);
  assert.deepEqual(sessionsOnDay([session], new Date(2026, 2, 30)), []);
});
