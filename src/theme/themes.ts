import { palette } from './palette';
import { iconSizes, radii, spacing, typography } from './tokens';

const lightColors = {
  background: palette.neutral[50],
  surface: palette.white,
  surfaceMuted: palette.neutral[100],
  text: palette.neutral[900],
  textMuted: palette.neutral[500],
  border: palette.neutral[200],
  primary: palette.brand[600],
  primaryMuted: palette.brand[50],
  onPrimary: palette.white,
  danger: palette.red[600],
  onDanger: palette.white,
  success: palette.green[600],
  warning: palette.amber[600],
  favorite: palette.red[600],
  media: palette.brand[100],
  scrim: palette.scrim,
};

export type ColorTokens = Record<keyof typeof lightColors, string>;
export type ColorToken = keyof ColorTokens;

const darkColors: ColorTokens = {
  background: palette.neutral[950],
  surface: palette.neutral[900],
  surfaceMuted: palette.neutral[800],
  text: palette.neutral[50],
  textMuted: palette.neutral[400],
  border: palette.neutral[800],
  primary: palette.brand[400],
  primaryMuted: palette.brand[950],
  onPrimary: palette.neutral[950],
  danger: palette.red[400],
  onDanger: palette.neutral[950],
  success: palette.green[400],
  warning: palette.amber[400],
  favorite: palette.red[400],
  // Backdrop behind product photos; the same light tint in both themes.
  media: palette.brand[100],
  scrim: palette.scrim,
};

export type Theme = {
  dark: boolean;
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  iconSizes: typeof iconSizes;
};

export const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
  spacing,
  radii,
  typography,
  iconSizes,
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
  spacing,
  radii,
  typography,
  iconSizes,
};
