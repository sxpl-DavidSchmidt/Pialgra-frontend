import test from 'node:test';
import assert from 'node:assert/strict';
import { studyMinutesByDay } from '../src/components/TimeTableSummary/studyActivity.js';

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
