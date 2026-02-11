import { FERBER_INTERVALS } from '../constants/ferber';

export function getIntervalMinutes(day, checkIndex) {
  const intervals = day <= 7 ? FERBER_INTERVALS[day] : FERBER_INTERVALS.beyond;
  if (day > 7) return intervals[0];
  if (checkIndex < 3) return intervals[checkIndex];
  return intervals[3]; // subsequent checks
}

export function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Returns ordinal string for a 1-based index: 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", 11 -> "11th", etc.
 */
export function ordinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return n + 'th';
  switch (v % 10) {
    case 1: return n + 'st';
    case 2: return n + 'nd';
    case 3: return n + 'rd';
    default: return n + 'th';
  }
}

/**
 * Returns today's date as YYYY-MM-DD in local timezone (for calendar-day math).
 */
export function getTodayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Given a program start date (YYYY-MM-DD), returns the current day number (1-based).
 * Day = calendar days between start and today + 1. Capped at 8 for "Day 8+".
 * If programStartDate is null/invalid, returns 1.
 */
export function getCurrentDay(programStartDate) {
  if (!programStartDate || typeof programStartDate !== 'string') return 1;
  const today = getTodayString();
  const start = new Date(programStartDate + 'T12:00:00');
  const end = new Date(today + 'T12:00:00');
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  const diffMs = end - start;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const day = diffDays + 1;
  if (day < 1) return 1;
  return Math.min(day, 8);
}
