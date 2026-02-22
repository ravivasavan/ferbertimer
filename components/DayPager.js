import React from 'react';
import { View, StyleSheet } from 'react-native';
import TimerScreen from './TimerScreen';

/**
 * Renders the timer for the current day. Day changes only via the
 * DayCarousel pills at the top of TimerScreen (no horizontal swipe).
 */
export default function DayPager({ currentDay, onDayChange }) {
  return (
    <View style={styles.container}>
      <TimerScreen
        day={currentDay}
        onDayChange={onDayChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
