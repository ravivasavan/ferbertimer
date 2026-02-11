import { getIntervalMinutes, formatTime, ordinal } from '../../utils/time';

describe('getIntervalMinutes', () => {
  it('returns correct minutes for day 1', () => {
    expect(getIntervalMinutes(1, 0)).toBe(3);
    expect(getIntervalMinutes(1, 1)).toBe(5);
    expect(getIntervalMinutes(1, 2)).toBe(10);
    expect(getIntervalMinutes(1, 3)).toBe(10);
    expect(getIntervalMinutes(1, 10)).toBe(10);
  });

  it('returns correct minutes for day 7', () => {
    expect(getIntervalMinutes(7, 0)).toBe(20);
    expect(getIntervalMinutes(7, 1)).toBe(25);
    expect(getIntervalMinutes(7, 2)).toBe(30);
    expect(getIntervalMinutes(7, 3)).toBe(30);
  });

  it('returns 30 for day 8+', () => {
    expect(getIntervalMinutes(8, 0)).toBe(30);
    expect(getIntervalMinutes(9, 0)).toBe(30);
  });
});

describe('formatTime', () => {
  it('formats zero', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats minutes and seconds with leading zeros', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(600)).toBe('10:00');
    expect(formatTime(90)).toBe('01:30');
  });

  it('formats large values', () => {
    expect(formatTime(3600)).toBe('60:00');
  });
});

describe('ordinal', () => {
  it('returns 1st, 2nd, 3rd for first three', () => {
    expect(ordinal(1)).toBe('1st');
    expect(ordinal(2)).toBe('2nd');
    expect(ordinal(3)).toBe('3rd');
  });

  it('returns th for 4-10', () => {
    expect(ordinal(4)).toBe('4th');
    expect(ordinal(5)).toBe('5th');
    expect(ordinal(10)).toBe('10th');
  });

  it('handles 11, 12, 13 as th', () => {
    expect(ordinal(11)).toBe('11th');
    expect(ordinal(12)).toBe('12th');
    expect(ordinal(13)).toBe('13th');
  });

  it('handles 21, 22, 23 correctly', () => {
    expect(ordinal(21)).toBe('21st');
    expect(ordinal(22)).toBe('22nd');
    expect(ordinal(23)).toBe('23rd');
  });
});
