import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayString } from './time';

const KEY_PROGRAM_START = '@ferbertimer/programStartDate';
const KEY_TIMER_PREFIX = '@ferbertimer/timer_';

export async function getProgramStartDate() {
  try {
    return await AsyncStorage.getItem(KEY_PROGRAM_START);
  } catch (e) {
    return null;
  }
}

export async function setProgramStartDate(dateString) {
  try {
    if (dateString == null) {
      await AsyncStorage.removeItem(KEY_PROGRAM_START);
    } else {
      await AsyncStorage.setItem(KEY_PROGRAM_START, dateString);
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Resets the whole program: sets program start to today and clears all timer state.
 */
export async function resetProgram() {
  try {
    await setProgramStartDate(getTodayString());
    for (let day = 1; day <= 8; day++) {
      await AsyncStorage.removeItem(timerKey(day));
    }
  } catch (e) {
    // ignore
  }
}

export function timerKey(day) {
  return `${KEY_TIMER_PREFIX}${day}`;
}

export async function getTimerState(day) {
  try {
    const json = await AsyncStorage.getItem(timerKey(day));
    if (!json) return null;
    const data = JSON.parse(json);
    return {
      checkIndex: data.checkIndex ?? 0,
      secondsLeft: data.secondsLeft ?? 0,
      isRunning: data.isRunning ?? false,
      endTimestamp: data.endTimestamp ?? null,
    };
  } catch (e) {
    return null;
  }
}

export async function setTimerState(day, state) {
  try {
    await AsyncStorage.setItem(timerKey(day), JSON.stringify(state));
  } catch (e) {
    // ignore
  }
}
