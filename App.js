import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Vibration,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Ferber method check-in intervals (in minutes)
// Each day has: [1st check, 2nd check, 3rd check, subsequent checks]
const FERBER_INTERVALS = {
  1: [3, 5, 10, 10],
  2: [5, 10, 12, 12],
  3: [10, 12, 15, 15],
  4: [12, 15, 17, 17],
  5: [15, 17, 20, 20],
  6: [17, 20, 25, 25],
  7: [20, 25, 30, 30],
  beyond: [30],
};

function getIntervalMinutes(day, checkIndex) {
  const intervals = day <= 7 ? FERBER_INTERVALS[day] : FERBER_INTERVALS.beyond;
  if (day > 7) return intervals[0];
  if (checkIndex < 3) return intervals[checkIndex];
  return intervals[3]; // subsequent checks
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// --- Day Selection Screen ---
function DaySelector({ onSelectDay }) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.daySelectContainer}
    >
      <Text style={styles.title}>Ferber Method Timer</Text>
      <Text style={styles.subtitle}>Select your training day</Text>

      <View style={styles.dayGrid}>
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const intervals = FERBER_INTERVALS[day];
          return (
            <TouchableOpacity
              key={day}
              style={styles.dayCard}
              onPress={() => onSelectDay(day)}
              activeOpacity={0.7}
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

// --- Timer Screen ---
function TimerScreen({ day, onBack }) {
  const [checkIndex, setCheckIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(
    getIntervalMinutes(day, 0) * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const currentIntervalMin = getIntervalMinutes(day, checkIndex);
  const totalSeconds = currentIntervalMin * 60;

  // Create a beep using Web Audio API (web) or Vibration (native)
  const playAlert = useCallback(() => {
    if (Platform.OS === 'web') {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        // Play three short beeps
        [0, 0.25, 0.5].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 440;
          gain.gain.value = 0.3;
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.15);
        });
      } catch (e) {
        // Audio not available
      }
    } else {
      Vibration.vibrate([0, 300, 200, 300, 200, 300]);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsComplete(true);
            playAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, playAlert]);

  const handleStart = () => {
    if (isComplete) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleCheckinDone = () => {
    const nextIndex = checkIndex + 1;
    setCheckIndex(nextIndex);
    const nextMinutes = getIntervalMinutes(day, nextIndex);
    setSecondsLeft(nextMinutes * 60);
    setIsComplete(false);
    setIsRunning(false);
  };

  const handleReset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    setIsComplete(false);
  };

  const progress = 1 - secondsLeft / totalSeconds;
  const progressWidth = `${Math.min(progress * 100, 100)}%`;

  const checkLabel =
    day > 7
      ? 'Interval'
      : checkIndex === 0
        ? '1st check-in'
        : checkIndex === 1
          ? '2nd check-in'
          : checkIndex === 2
            ? '3rd check-in'
            : `Check-in #${checkIndex + 1}`;

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.timerDay}>
          {day <= 7 ? `Day ${day}` : 'Day 8+'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.timerBody}>
        <Text style={styles.checkLabel}>{checkLabel}</Text>
        <Text style={styles.waitText}>
          Wait {currentIntervalMin} minute{currentIntervalMin !== 1 ? 's' : ''}
        </Text>

        <View style={styles.timerCircle}>
          <Text style={[styles.timerDisplay, isComplete && styles.timerDone]}>
            {formatTime(secondsLeft)}
          </Text>
          {isComplete && (
            <Text style={styles.completeText}>Time to check in!</Text>
          )}
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>

        <View style={styles.timerControls}>
          {!isRunning && !isComplete && (
            <TouchableOpacity
              style={[styles.controlBtn, styles.startBtn]}
              onPress={handleStart}
              activeOpacity={0.7}
            >
              <Text style={styles.controlBtnText}>
                {secondsLeft < totalSeconds ? 'Resume' : 'Start'}
              </Text>
            </TouchableOpacity>
          )}

          {isRunning && (
            <TouchableOpacity
              style={[styles.controlBtn, styles.pauseBtn]}
              onPress={handlePause}
              activeOpacity={0.7}
            >
              <Text style={styles.controlBtnText}>Pause</Text>
            </TouchableOpacity>
          )}

          {isComplete && (
            <TouchableOpacity
              style={[styles.controlBtn, styles.checkinBtn]}
              onPress={handleCheckinDone}
              activeOpacity={0.7}
            >
              <Text style={styles.controlBtnText}>
                Check-in Done → Next
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {(secondsLeft < totalSeconds || isComplete) && !isRunning && (
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset this interval</Text>
          </TouchableOpacity>
        )}

        {day <= 7 && (
          <View style={styles.scheduleBox}>
            <Text style={styles.scheduleTitle}>Tonight's schedule</Text>
            {FERBER_INTERVALS[day].slice(0, 3).map((min, i) => (
              <Text
                key={i}
                style={[
                  styles.scheduleItem,
                  i === checkIndex && !isComplete && styles.scheduleActive,
                  i < checkIndex && styles.scheduleDone,
                ]}
              >
                {i < checkIndex ? '✓ ' : i === checkIndex ? '▶ ' : '   '}
                {i === 0
                  ? '1st'
                  : i === 1
                    ? '2nd'
                    : '3rd'}{' '}
                check: {min} min
              </Text>
            ))}
            <Text
              style={[
                styles.scheduleItem,
                checkIndex >= 3 && !isComplete && styles.scheduleActive,
              ]}
            >
              {checkIndex >= 3 ? '▶ ' : '   '}Then:{' '}
              {FERBER_INTERVALS[day][3]} min each
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// --- Main App ---
export default function App() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {selectedDay === null ? (
        <DaySelector onSelectDay={setSelectedDay} />
      ) : (
        <TimerScreen day={selectedDay} onBack={() => setSelectedDay(null)} />
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
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
    color: '#e0e0ff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8888aa',
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
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    width: 145,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a5a',
  },
  beyondCard: {
    width: 302,
    borderColor: '#4a3a6a',
    backgroundColor: '#1e1a3e',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c0c0ff',
    marginBottom: 4,
  },
  dayIntervals: {
    fontSize: 14,
    color: '#9090cc',
  },
  daySubsequent: {
    fontSize: 12,
    color: '#6868aa',
    marginTop: 2,
  },
  infoBox: {
    marginTop: 28,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    maxWidth: 500,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2a2a5a',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c0c0ff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8888aa',
    lineHeight: 20,
  },

  // Timer screen
  timerContainer: {
    flex: 1,
    paddingTop: 50,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 70,
  },
  backText: {
    fontSize: 16,
    color: '#8888cc',
  },
  timerDay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e0e0ff',
    textAlign: 'center',
  },
  timerBody: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a0a0dd',
    marginBottom: 4,
  },
  waitText: {
    fontSize: 15,
    color: '#7070aa',
    marginBottom: 24,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#16213e',
    borderWidth: 3,
    borderColor: '#3a3a7a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timerDisplay: {
    fontSize: 52,
    fontWeight: '300',
    color: '#e0e0ff',
    fontVariant: ['tabular-nums'],
  },
  timerDone: {
    color: '#66bb6a',
  },
  completeText: {
    fontSize: 14,
    color: '#66bb6a',
    marginTop: 4,
    fontWeight: '600',
  },
  progressBarBg: {
    width: '80%',
    maxWidth: 300,
    height: 6,
    backgroundColor: '#2a2a5a',
    borderRadius: 3,
    marginBottom: 28,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6c63ff',
    borderRadius: 3,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  controlBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: '#6c63ff',
  },
  pauseBtn: {
    backgroundColor: '#e67e22',
  },
  checkinBtn: {
    backgroundColor: '#27ae60',
  },
  controlBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  resetBtn: {
    marginTop: 4,
    padding: 8,
  },
  resetText: {
    color: '#6868aa',
    fontSize: 14,
  },
  scheduleBox: {
    marginTop: 24,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#2a2a5a',
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a0a0dd',
    marginBottom: 8,
  },
  scheduleItem: {
    fontSize: 14,
    color: '#6868aa',
    paddingVertical: 3,
    fontVariant: ['tabular-nums'],
  },
  scheduleActive: {
    color: '#c0c0ff',
    fontWeight: '600',
  },
  scheduleDone: {
    color: '#4a8a4a',
  },
});
