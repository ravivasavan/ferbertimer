import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { FERBER_INTERVALS } from '../constants/ferber';

function getStyles(theme) {
  const { colors } = theme;
  return StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    daySelectContainer: {
      padding: 20,
      paddingTop: 60,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.onBackground,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      marginBottom: 24,
    },
    dayGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      maxWidth: 500,
      width: '100%',
    },
    dayCard: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      width: 145,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    beyondCard: {
      width: 302,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
    },
    dayNumber: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onSurface,
      marginBottom: 4,
    },
    dayIntervals: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
    },
    daySubsequent: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginTop: 2,
      opacity: 0.9,
    },
    infoBox: {
      marginTop: 28,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      maxWidth: 500,
      width: '100%',
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onSurface,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      lineHeight: 20,
    },
  });
}

export default function DaySelector({ onSelectDay }) {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.daySelectContainer}
      accessibilityRole="list"
      accessibilityLabel="Select your Ferber training day"
    >
      <Text style={styles.title}>Ferber Method Timer</Text>
      <Text style={styles.subtitle}>Select your training day</Text>

      <View style={styles.dayGrid}>
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const intervals = FERBER_INTERVALS[day];
          const label = `Day ${day}, intervals ${intervals[0]}, ${intervals[1]}, ${intervals[2]} minutes then ${intervals[3]} minutes`;
          return (
            <TouchableOpacity
              key={day}
              style={styles.dayCard}
              onPress={() => onSelectDay(day)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <Text style={styles.dayNumber}>Day {day}</Text>
              <Text style={styles.dayIntervals}>
                {intervals[0]} / {intervals[1]} / {intervals[2]} min
              </Text>
              <Text style={styles.daySubsequent}>
                then {intervals[3]} min
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.dayCard, styles.beyondCard]}
          onPress={() => onSelectDay(8)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Day 8 and beyond, single 30 minute interval"
        >
          <Text style={styles.dayNumber}>Day 8+</Text>
          <Text style={styles.dayIntervals}>30 min</Text>
          <Text style={styles.daySubsequent}>single interval</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          After putting your baby down drowsy but awake, wait for the first
          interval before a brief check-in. Each subsequent wait gets a little
          longer. Tap "Check-in Done" after each visit to start the next timer.
        </Text>
      </View>
    </ScrollView>
  );
}
