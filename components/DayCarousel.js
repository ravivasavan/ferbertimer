import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const DAYS = [1, 2, 3, 4, 5, 6, 7, 8];

function hexToRgba(hex, alpha) {
  const h = String(hex).replace(/^#/, '');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Horizontal day selector matching Figma "Days Carousel":
 * Day 1 … Day 7, Day 8+. Active pill: accent bg/border; inactive: surface variant.
 */
export default function DayCarousel({ currentDay, onDayChange }) {
  const theme = useTheme();
  const accent = theme.colors.accent ?? '#a4e323';
  const activeBg = hexToRgba(accent, 0.1);
  const activeBorder = hexToRgba(accent, 0.2);
  const inactiveBg = theme.colors.surfaceVariant ?? 'rgba(255,255,255,0.1)';
  const inactiveBorder = theme.colors.outlineVariant ?? 'rgba(255,255,255,0.2)';
  const activeText = accent;
  const inactiveText = theme.colors.onSurface ?? '#FFFFFF';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
      accessibilityRole="list"
      accessibilityLabel="Select day"
    >
      {DAYS.map((day) => {
        const isActive = day === currentDay;
        const label = day <= 7 ? `Day ${day}` : 'Day 8+';
        return (
          <TouchableOpacity
            key={day}
            onPress={() => onDayChange(day)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? activeBg : inactiveBg,
                borderColor: isActive ? activeBorder : inactiveBorder,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.pillText,
                { color: isActive ? activeText : inactiveText },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  pill: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '400',
  },
});
