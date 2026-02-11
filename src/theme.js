import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Figma-aligned design system (see docs/figma-specs.md)

const lightColors = {
  ...MD3LightTheme.colors,
  primary: '#1A1A1A',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E0E0E0',
  onPrimaryContainer: '#1A1A1A',
  secondary: '#5C5C5C',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#F0F0F0',
  onSecondaryContainer: '#1A1A1A',
  tertiary: '#9E9E9E',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#F5F5F5',
  onTertiaryContainer: '#1A1A1A',
  background: '#F9F9F9',
  onBackground: '#1A1A1A',
  surface: '#FFFFFF',
  onSurface: '#1A1A1A',
  surfaceVariant: '#F2F2F2',
  onSurfaceVariant: '#4D4D4D',
  outline: '#D6D6D6',
  outlineVariant: '#EBEBEB',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  // Figma: accent (active, progress, CTA highlight)
  accent: '#2E7D32',
  onAccent: '#FFFFFF',
  // Primary CTA: filled button (Start)
  primaryButtonBackground: '#1A1A1A',
  onPrimaryButtonBackground: '#FFFFFF',
  // Timer circle (light: use surface or subtle tint)
  timerCircleInner: '#E8E8E8',
  elevation: {
    level0: 'transparent',
    level1: '#FFFFFF',
    level2: '#F7F7F7',
    level3: '#F0F0F0',
    level4: '#EBEBEB',
    level5: '#E6E6E6',
  },
};

const darkColors = {
  ...MD3DarkTheme.colors,
  primary: '#F2F2F2',
  onPrimary: '#121212',
  primaryContainer: '#333333',
  onPrimaryContainer: '#F2F2F2',
  secondary: '#C7C7C7',
  onSecondary: '#121212',
  secondaryContainer: '#2C2C2C',
  onSecondaryContainer: '#F2F2F2',
  tertiary: '#A0A0A0',
  onTertiary: '#121212',
  tertiaryContainer: '#252525',
  onTertiaryContainer: '#F2F2F2',
  background: '#1D1D1D', // Figma: Ferber Timer screens
  onBackground: '#E0E0E0',
  surface: '#1E1E1E',
  onSurface: '#E0E0E0',
  surfaceVariant: '#2C2C2C',
  onSurfaceVariant: '#C7C7C7',
  outline: '#4D4D4D',
  outlineVariant: '#333333',
  error: '#F28B82',
  onError: '#690005',
  // Figma: accent #a4e323 (progress ring, Check-in!, active card)
  accent: '#a4e323',
  onAccent: '#121212',
  // Primary CTA: white button with dark text (Start)
  primaryButtonBackground: '#FFFFFF',
  onPrimaryButtonBackground: '#121212',
  // Timer circle inner (Figma #383d26)
  timerCircleInner: '#383d26',
  elevation: {
    level0: 'transparent',
    level1: '#1E1E1E',
    level2: '#232323',
    level3: '#252525',
    level4: '#2A2A2A',
    level5: '#2F2F2F',
  },
};

export const LightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
};
