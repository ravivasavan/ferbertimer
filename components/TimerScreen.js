import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Vibration,
  ScrollView,
} from 'react-native';
import {
  Text,
  Button,
  useTheme,
  TouchableRipple,
} from 'react-native-paper';
import {
  Play,
  SkipForward,
  FastForward,
  ArrowCounterClockwise,
  Clock,
  CheckCircle,
} from 'phosphor-react-native';
import { FERBER_INTERVALS, BEEP_FREQUENCY_HZ, BEEP_GAIN, BEEP_DURATION, BEEP_DELAYS, VIBRATION_PATTERN } from '../constants/ferber';
import { FIGMA_FRAME, FIGMA_SPACING, FIGMA_CARD, FIGMA_BUTTON } from '../constants/design';
import { getIntervalMinutes } from '../utils/time';
import { getTimerState, setTimerState } from '../utils/storage';
import TimerDisplay from './TimerDisplay';
import DayCarousel from './DayCarousel';

export default function TimerScreen({ day, currentDay: currentDayProp, onDayChange }) {
  const currentDay = currentDayProp ?? day;
  const theme = useTheme();
  
  const [checkIndex, setCheckIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() => getIntervalMinutes(day, 0) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const intervalRef = useRef(null);
  const endTimestampRef = useRef(null);
  const audioContextRef = useRef(null);

  const currentIntervalMin = getIntervalMinutes(day, checkIndex);
  const totalSeconds = currentIntervalMin * 60;

  const showSnackbar = () => {}; // Notification toasts disabled

  const getOrCreateAudioContext = useCallback(() => {
    if (Platform.OS !== 'web') return null;
    if (audioContextRef.current) return audioContextRef.current;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      const ctx = new Ctx();
      audioContextRef.current = ctx;
      return ctx;
    } catch (e) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('Ferber Timer: AudioContext not available', e);
      setAudioError('Sound unavailable');
      return null;
    }
  }, []);

  const playAlert = useCallback(() => {
    if (Platform.OS === 'web') {
      const ctx = getOrCreateAudioContext();
      if (!ctx) return;
      try {
        if (ctx.state === 'suspended') ctx.resume();
        playBeeps(ctx);
      } catch (e) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('Ferber Timer: play failed', e);
        setAudioError('Sound unavailable');
      }
    }
    // Native: repeating vibration is started by effect when isComplete becomes true
  }, [getOrCreateAudioContext]);

  useEffect(() => {
    let cancelled = false;
    getTimerState(day).then((saved) => {
      if (cancelled) return;
      if (saved) {
        const now = Date.now();
        let running = saved.isRunning;
        let secs = saved.secondsLeft;
        if (saved.isRunning && saved.endTimestamp != null) {
          const remaining = Math.max(0, Math.ceil((saved.endTimestamp - now) / 1000));
          secs = remaining;
          if (remaining <= 0) running = false;
        }
        setCheckIndex(saved.checkIndex);
        setSecondsLeft(secs);
        setIsRunning(running);
        setIsComplete(!running && secs === 0 && (saved.endTimestamp != null || saved.secondsLeft === 0));
        if (running) endTimestampRef.current = saved.endTimestamp;
      } else {
        const initialMinutes = getIntervalMinutes(day, 0);
        setCheckIndex(0);
        setSecondsLeft(initialMinutes * 60);
        setIsRunning(false);
        setIsComplete(false);
        endTimestampRef.current = null;
      }
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, [day]);

  useEffect(() => {
    if (!hydrated) return;
    const state = {
      checkIndex,
      secondsLeft,
      isRunning,
      endTimestamp: isRunning ? endTimestampRef.current : null,
    };
    setTimerState(day, state);
  }, [day, hydrated, checkIndex, secondsLeft, isRunning]);

  useEffect(() => {
    if (!isRunning || !hydrated) return;
    if (endTimestampRef.current == null) {
      endTimestampRef.current = Date.now() + secondsLeft * 1000;
    }
    const tick = () => {
      const now = Date.now();
      const end = endTimestampRef.current;
      if (end == null) return;
      const remaining = Math.max(0, Math.ceil((end - now) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        setIsComplete(true);
        playAlert();
        showSnackbar('Time to check in!');
      }
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning, hydrated, playAlert]);

  useEffect(() => {
    if (!isRunning) endTimestampRef.current = null;
  }, [isRunning]);

  // Keep vibrating (native) until user taps check-in
  useEffect(() => {
    if (isComplete && Platform.OS !== 'web') {
      Vibration.vibrate(VIBRATION_PATTERN, true);
    }
    return () => {
      if (Platform.OS !== 'web') Vibration.cancel();
    };
  }, [isComplete]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStart = () => {
    if (isComplete) return;
    endTimestampRef.current = Date.now() + secondsLeft * 1000;
    setIsRunning(true);
    showSnackbar('Timer started');
  };

  const handleCheckinDone = () => {
    const nextIndex = checkIndex + 1;
    setCheckIndex(nextIndex);
    const nextMinutes = getIntervalMinutes(day, nextIndex);
    setSecondsLeft(nextMinutes * 60);
    setIsComplete(false);
    setIsRunning(false);
    endTimestampRef.current = null;
    showSnackbar('Moved to next interval');
  };

  const handleReset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    setIsComplete(false);
    endTimestampRef.current = null;
    showSnackbar('Interval reset');
  };

  const handleSelectInterval = (index) => {
    setCheckIndex(index);
    const minutes = getIntervalMinutes(day, index);
    setSecondsLeft(minutes * 60);
    setIsComplete(false);
    setIsRunning(false);
    endTimestampRef.current = null;
  };

  if (!hydrated) {
    return (
      <View style={[styles.timerContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onBackground }}>Loading…</Text>
      </View>
    );
  }

  const dayLabel = day <= 7 ? `Day ${day}` : 'Day 8+';
  const intervalNumber = day > 7 ? 1 : checkIndex + 1;
  const metadataText = `${dayLabel} · Interval ${intervalNumber}`;

  const intervalRows =
    day <= 7
      ? [
          { index: 0, label: '1st check', min: FERBER_INTERVALS[day][0] },
          { index: 1, label: '2nd check', min: FERBER_INTERVALS[day][1] },
          { index: 2, label: '3rd check', min: FERBER_INTERVALS[day][2] },
          { index: 3, label: 'Then', min: FERBER_INTERVALS[day][3] },
        ]
      : [{ index: 0, label: 'Interval', min: FERBER_INTERVALS.beyond[0] }];

  // Figma Landing: Start button = white bg, dark text (primary CTA)
  const startButtonBg = theme.colors.primaryButtonBackground ?? '#FFFFFF';
  const startButtonFg = theme.colors.onPrimaryButtonBackground ?? '#121212';
  // Resume / accent when paused mid-interval
  const accentBg = theme.colors.accent ?? '#a4e323';
  const accentFg = theme.colors.onAccent ?? '#121212';

  return (
    <View style={[styles.timerContainer, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollBody}>
        <View style={styles.timerBody}>
          {onDayChange != null && (
            <DayCarousel currentDay={currentDay} onDayChange={onDayChange} />
          )}
          <TimerDisplay
            secondsLeft={secondsLeft}
            totalSeconds={totalSeconds}
            isComplete={isComplete}
          />
          <Text style={[styles.metadataText, { color: theme.colors.accent ?? '#a4e323' }]}>{metadataText}</Text>

          <View style={styles.controlsContainer}>
            {isComplete ? (
              <Button
                mode="outlined"
                onPress={handleCheckinDone}
icon={({ size, color }) => <SkipForward size={size} color={color} weight="fill" />}
                  contentStyle={styles.primaryButtonContent}
                  style={[styles.buttonOutlined, { borderColor: theme.colors.outline }]}
                  labelStyle={[styles.buttonLabel, { color: theme.colors.onSurface }]}
                >
                  Next interval
              </Button>
            ) : isRunning ? (
              <>
                <Button
                  mode="outlined"
                  onPress={handleReset}
                  icon={({ size, color }) => <ArrowCounterClockwise size={size} color={color} weight="fill" />}
                  contentStyle={styles.primaryButtonContent}
                  style={[styles.buttonOutlined, { borderColor: theme.colors.outline }]}
                  labelStyle={[styles.buttonLabel, { color: theme.colors.onSurface }]}
                >
                  Reset
                </Button>
                <View style={styles.buttonGap} />
                <Button
                  mode="outlined"
                  onPress={handleCheckinDone}
                  icon={({ size, color }) => <FastForward size={size} color={color} weight="fill" />}
                  contentStyle={styles.primaryButtonContent}
                  style={[styles.buttonOutlined, { borderColor: theme.colors.outline }]}
                  labelStyle={[styles.buttonLabel, { color: theme.colors.onSurface }]}
                >
                  Skip
                </Button>
              </>
            ) : secondsLeft < totalSeconds ? (
              <>
                <Button
                  mode="contained"
                  onPress={handleStart}
                  buttonColor={accentBg}
                  textColor={accentFg}
                  icon={({ size, color }) => <Play size={size} color={accentFg} weight="fill" />}
                  contentStyle={styles.primaryButtonContent}
                  style={styles.buttonPrimary}
                  labelStyle={[styles.buttonLabel, { color: accentFg }]}
                >
                  Resume
                </Button>
                <View style={styles.buttonGap} />
                <Button
                  mode="outlined"
                  onPress={handleReset}
                  icon={({ size, color }) => <ArrowCounterClockwise size={size} color={theme.colors.onSurface} weight="fill" />}
                  contentStyle={styles.primaryButtonContent}
                  style={[styles.buttonOutlined, { borderColor: theme.colors.outline }]}
                  labelStyle={[styles.buttonLabel, { color: theme.colors.onSurface }]}
                >
                  Reset
                </Button>
              </>
            ) : (
              <Button
                mode="contained"
                onPress={handleStart}
                buttonColor={startButtonBg}
                textColor={startButtonFg}
                icon={({ size, color }) => <Play size={size} color={startButtonFg} weight="fill" />}
                contentStyle={styles.primaryButtonContent}
                style={styles.buttonPrimary}
                labelStyle={[styles.buttonLabel, { color: startButtonFg }]}
              >
                Start
              </Button>
            )}
          </View>

          {audioError && <Text style={[styles.audioError, { color: theme.colors.error }]}>{audioError}</Text>}

          <View style={styles.scheduleList}>
            {intervalRows.map((row) => {
              const isCurrent = row.index === checkIndex;
              const isDone = row.index < checkIndex;
              const accent = theme.colors.accent;
              const showCheck = isCurrent || isDone;
              // Figma Interval Complete: completed card uses opacity 40%
              const opacity = isDone ? 0.4 : 1;
              // Figma: default bg #1E1E1E/#2C2C2C border #333333; active bg rgba(accent,0.1) border accent
              return (
                <TouchableRipple
                  key={row.index}
                  onPress={() => handleSelectInterval(row.index)}
                  style={[
                    styles.scheduleItem,
                    {
                      backgroundColor: isCurrent ? theme.colors.surfaceVariant : theme.colors.surface,
                      borderColor: isCurrent ? accent : theme.colors.outlineVariant,
                      borderWidth: 1,
                      opacity,
                    }
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${row.label}, ${row.min} minutes${isCurrent ? ', selected' : ''}${isDone ? ', completed' : ''}`}
                  accessibilityState={{ selected: isCurrent }}
                >
                  <View style={styles.scheduleItemContent}>
                    <View style={styles.scheduleItemRow}>
                      {showCheck ? (
                        <CheckCircle size={20} color={accent ?? theme.colors.primary} weight="fill" />
                      ) : (
                        <Clock size={20} color={theme.colors.onSurfaceVariant} weight="fill" />
                      )}
                      <Text style={[styles.cardLabel, { color: showCheck ? (accent ?? theme.colors.primary) : theme.colors.onSurfaceVariant, fontWeight: isCurrent ? 'bold' : 'normal' }]}>
                        {row.label}
                      </Text>
                    </View>
                    <Text style={[styles.cardDuration, { color: showCheck ? (accent ?? theme.colors.primary) : theme.colors.onSurface }]}>
                      {row.min} min
                    </Text>
                  </View>
                </TouchableRipple>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function playBeeps(ctx) {
  BEEP_DELAYS.forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = BEEP_FREQUENCY_HZ;
    gain.gain.value = BEEP_GAIN;
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + BEEP_DURATION);
  });
}

// Figma: 393×852 frame, padding top 24, right 23, bottom 24, left 24 (docs/figma-specs.md)
const PAD_L = FIGMA_FRAME.paddingLeft;
const PAD_R = FIGMA_FRAME.paddingRight;
const PAD_V = FIGMA_FRAME.paddingVertical;

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    paddingTop: PAD_V,
  },
  scrollBody: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  timerBody: {
    alignItems: 'center',
    paddingLeft: PAD_L,
    paddingRight: PAD_R,
    paddingBottom: PAD_V,
  },
  // Day · Interval — Figma: Medium 16/24, uppercase
  metadataText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: FIGMA_SPACING.metadataToControls,
    textTransform: 'uppercase',
  },
  controlsContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: FIGMA_SPACING.metadataToControls,
    marginBottom: FIGMA_SPACING.controlsToGrid,
    alignItems: 'stretch',
  },
  primaryButtonContent: {
    height: FIGMA_BUTTON.height,
  },
  buttonPrimary: {
    borderRadius: FIGMA_BUTTON.borderRadius,
    flex: 1,
    minHeight: FIGMA_BUTTON.height,
  },
  buttonOutlined: {
    borderRadius: FIGMA_BUTTON.borderRadius,
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: FIGMA_BUTTON.height,
  },
  // Figma: Button label Medium 18/26
  buttonLabel: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500',
  },
  buttonGap: {
    width: FIGMA_CARD.gapBetweenButtons,
  },
  audioError: {
    marginTop: 8,
    fontSize: 16,
  },
  scheduleList: {
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: FIGMA_CARD.rowGap,
  },
  scheduleItem: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  scheduleItemContent: {
    padding: 16,
    alignItems: 'flex-start',
  },
  scheduleItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  // Figma: Card label Normal/Bold 16/24
  cardLabel: {
    marginLeft: 8,
    fontSize: 16,
    lineHeight: 24,
  },
  // Figma: Card duration Bold 22/28
  cardDuration: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 'bold',
  },
});
