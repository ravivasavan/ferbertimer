// Ferber method check-in intervals (in minutes)
// Each day has: [1st check, 2nd check, 3rd check, subsequent checks]
export const FERBER_INTERVALS = {
  1: [3, 5, 10, 10],
  2: [5, 10, 12, 12],
  3: [10, 12, 15, 15],
  4: [12, 15, 17, 17],
  5: [15, 17, 20, 20],
  6: [17, 20, 25, 25],
  7: [20, 25, 30, 30],
  beyond: [30],
};

// Audio (web)
export const BEEP_FREQUENCY_HZ = 440;
export const BEEP_GAIN = 0.3;
export const BEEP_DURATION = 0.15;
export const BEEP_DELAYS = [0, 0.25, 0.5];

// Vibration (native) pattern: [pause, vibrate, pause, vibrate, pause, vibrate]
export const VIBRATION_PATTERN = [0, 300, 200, 300, 200, 300];
