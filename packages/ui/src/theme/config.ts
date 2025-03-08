import { createTamagui } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/theme-base';

const headingFont = createInterFont({
  size: {
    6: 15,
    7: 18,
    8: 20,
    9: 23,
    10: 28,
    11: 34,
    12: 40,
    13: 50,
    14: 60,
    15: 70,
    16: 80,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    6: '400',
    7: '600',
    8: '700',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    11: -4,
    12: -5,
    13: -6,
    14: -7,
    15: -8,
    16: -9,
  },
  face: {
    700: { normal: 'InterBold' },
    500: { normal: 'InterMedium' },
    400: { normal: 'Inter' },
  },
});

const bodyFont = createInterFont(
  {
    face: {
      700: { normal: 'InterBold' },
      500: { normal: 'InterMedium' },
      400: { normal: 'Inter' },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.5),
  }
);

// Custom theme colors
const customTokens = {
  ...tokens,
  color: {
    ...tokens.color,
    primary: '#4070F4',
    primaryLight: '#6B8DF6',
    primaryDark: '#2550CC',
    secondary: '#34B27B',
    secondaryLight: '#60CC99',
    secondaryDark: '#208A5C',
    danger: '#E53935',
    warning: '#FFB300',
    success: '#43A047',
    info: '#039BE5',
  },
};

const customThemes = {
  ...themes,
  light: {
    ...themes.light,
    primary: customTokens.color.primary,
    primaryLight: customTokens.color.primaryLight,
    primaryDark: customTokens.color.primaryDark,
    secondary: customTokens.color.secondary,
    secondaryLight: customTokens.color.secondaryLight,
    secondaryDark: customTokens.color.secondaryDark,
    danger: customTokens.color.danger,
    warning: customTokens.color.warning,
    success: customTokens.color.success,
    info: customTokens.color.info,
  },
  dark: {
    ...themes.dark,
    primary: customTokens.color.primary,
    primaryLight: customTokens.color.primaryLight,
    primaryDark: customTokens.color.primaryDark,
    secondary: customTokens.color.secondary,
    secondaryLight: customTokens.color.secondaryLight,
    secondaryDark: customTokens.color.secondaryDark,
    danger: customTokens.color.danger,
    warning: customTokens.color.warning,
    success: customTokens.color.success,
    info: customTokens.color.info,
  },
};

const config = createTamagui({
  defaultTheme: 'light',
  animations: {
    fast: {
      type: 'spring',
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    medium: {
      type: 'spring',
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
    slow: {
      type: 'spring',
      damping: 20,
      stiffness: 60,
    },
  },
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: customThemes,
  tokens: customTokens,
});

export type AppConfig = typeof config;

// @ts-expect-error
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
