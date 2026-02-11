import React, { useState, useEffect, Component, useMemo } from 'react';
import { View, Platform, StyleSheet, Text, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DayPager from './components/DayPager';
import { getProgramStartDate, setProgramStartDate, resetProgram } from './utils/storage';
import { getCurrentDay, getTodayString } from './utils/time';
import { LightTheme, DarkTheme } from './src/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    }),
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    }),
  },
  errorText: {
    fontSize: 16,
    marginBottom: 8,
  },
  errorStack: {
    fontSize: 12,
  },
});

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.errorStack}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export const ThemeContext = React.createContext({
  toggleTheme: () => {},
  isDark: false,
});

export default function App() {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [currentDay, setCurrentDay] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    getProgramStartDate()
      .then((startDate) => {
        if (startDate == null) {
          const today = getTodayString();
          setProgramStartDate(today).then(() => {
            setCurrentDay(getCurrentDay(today));
            setHydrated(true);
          });
        } else {
          setCurrentDay(getCurrentDay(startDate));
          setHydrated(true);
        }
      })
      .catch(() => {
        setCurrentDay(1);
        setHydrated(true);
      });
  }, []);

  const handleResetProgram = () => {
    resetProgram().then(() => {
      setCurrentDay(1);
    });
  };

  const handleDayChange = (selectedDay) => {
    setCurrentDay(selectedDay);
  };

  const themeContext = useMemo(
    () => ({
      toggleTheme: () => setIsDark((prev) => !prev),
      isDark,
    }),
    [isDark]
  );

  const theme = isDark ? DarkTheme : LightTheme;

  if (!hydrated) {
    return <View style={[styles.container, { backgroundColor: theme.colors.background }]} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={themeContext}>
        <PaperProvider theme={theme}>
          <ErrorBoundary>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              <DayPager
                currentDay={currentDay}
                onDayChange={handleDayChange}
                onResetProgram={handleResetProgram}
              />
            </View>
          </ErrorBoundary>
        </PaperProvider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}
