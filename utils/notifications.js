import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { VIBRATION_PATTERN } from '../constants/ferber';

const CHECK_IN_CHANNEL_ID = 'ferber-check-in';
let scheduledCheckInId = null;

// Show notification when app is in foreground; allow sound/vibration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Ensure Android notification channel exists with vibration so check-in
 * alerts work in background and when device is idle.
 */
async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  try {
    await Notifications.setNotificationChannelAsync(CHECK_IN_CHANNEL_ID, {
      name: 'Timer check-in',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: VIBRATION_PATTERN,
      enableVibration: true,
    });
  } catch (e) {
    if (__DEV__) console.warn('Ferber Timer: could not set notification channel', e);
  }
}

/**
 * Request notification permissions. Call before scheduling.
 */
export async function requestPermissions() {
  await ensureChannel();
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Schedule a local notification to fire at the exact timer end time.
 * Vibrates and shows "Time to check in!" even when app is backgrounded or phone is locked.
 */
export async function scheduleCheckInNotification(endTimestamp) {
  if (Platform.OS === 'web') return null;
  try {
    await ensureChannel();
    await cancelCheckInNotification();
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to check in!",
        body: "Ferber timer interval complete.",
        sound: true,
        ...(Platform.OS === 'ios' && { interruptionLevel: 'timeSensitive' }),
        ...(Platform.OS === 'android' && {
          priority: 'max',
          vibrationPattern: VIBRATION_PATTERN,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(endTimestamp),
        ...(Platform.OS === 'android' && { channelId: CHECK_IN_CHANNEL_ID }),
      },
    });
    scheduledCheckInId = id;
    return id;
  } catch (e) {
    if (__DEV__) console.warn('Ferber Timer: could not schedule notification', e);
    return null;
  }
}

/**
 * Cancel the scheduled check-in notification (e.g. on Reset, Skip, or Check-in done).
 */
export async function cancelCheckInNotification() {
  if (Platform.OS === 'web') return;
  try {
    if (scheduledCheckInId != null) {
      await Notifications.cancelScheduledNotificationAsync(scheduledCheckInId);
      scheduledCheckInId = null;
    }
  } catch (e) {
    if (__DEV__) console.warn('Ferber Timer: could not cancel notification', e);
  }
}
