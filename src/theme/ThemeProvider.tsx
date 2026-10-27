import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type Theme } from './themes';

export type ColorSchemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  preference: ColorSchemePreference;
  setPreference: (preference: ColorSchemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  initialPreference?: ColorSchemePreference;
}>;

export function ThemeProvider({
  children,
  initialPreference = 'system',
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] =
    useState<ColorSchemePreference>(initialPreference);

  // Keep native UI (keyboard, alerts, pickers) in sync with the in-app choice.
  useEffect(() => {
    Appearance.setColorScheme(
      preference === 'system' ? 'unspecified' : preference,
    );
  }, [preference]);

  const scheme = preference === 'system' ? systemScheme : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: scheme === 'dark' ? darkTheme : lightTheme,
      preference,
      setPreference,
    }),
    [scheme, preference],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

function useThemeContext(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('Theme hooks must be used inside <ThemeProvider>.');
  }
  return context;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}

export function useColorSchemePreference() {
  const { preference, setPreference } = useThemeContext();
  return { preference, setPreference };
}
