import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import { formatTime } from '../utils/time';
import { FIGMA_TIMER, FIGMA_SPACING } from '../constants/design';

// Figma: 220px diameter, 12px stroke, inner #383d26, progress #a4e323, track = progress at 10% opacity
function hexToRgba(hex, alpha) {
  const h = hex.replace(/^#/, '');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const SIZE = FIGMA_TIMER.diameter;
const STROKE_WIDTH = FIGMA_TIMER.strokeWidth;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const INNER_RADIUS = RADIUS - STROKE_WIDTH / 2;

/**
 * Timer circle and countdown display. Isolated so only this subtree re-renders every second.
 */
export default function TimerDisplay({ secondsLeft, totalSeconds, isComplete }) {
  const theme = useTheme();
  const circumference = RADIUS * 2 * Math.PI;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const progressColor = theme.colors.accent ?? '#a4e323';
  const trackColor = hexToRgba(progressColor, 0.1);
  const innerFill = theme.colors.timerCircleInner ?? '#383d26';
  const textColor = theme.colors.onSurface;
  const accentColor = theme.colors.accent ?? '#a4e323';

  return (
    <View
      style={styles.container}
      accessibilityLabel={isComplete ? "Time's up, check in" : `${formatTime(secondsLeft)} remaining`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: totalSeconds, now: totalSeconds - secondsLeft }}
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.svgContainer, { width: SIZE, height: SIZE }]}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          {/* Inner fill (Figma timer circle background) */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={INNER_RADIUS}
            fill={innerFill}
          />
          {/* Track (inactive ring) */}
          <Circle
            stroke={trackColor}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          {/* Progress ring (accent) */}
          <Circle
            stroke={progressColor}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View style={styles.textContainer}>
          {!isComplete ? (
            <Text
              style={[styles.timerText, { color: textColor }]}
            >
              {formatTime(secondsLeft)}
            </Text>
          ) : (
            <Text style={[styles.checkinText, { color: accentColor }]}>
              Check-in!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: FIGMA_SPACING.timerTopMargin,
    marginBottom: FIGMA_SPACING.timerToControls,
    paddingVertical: 10,
  },
  svgContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  timerText: {
    fontVariant: ['tabular-nums'],
    fontWeight: '300',
    fontSize: 72,
    lineHeight: 84,
  },
  checkinText: {
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 32,
  },
});
