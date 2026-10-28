/**
 * Raw color values. Components should not import this directly — use the
 * semantic tokens from `useTheme().colors` so light/dark mode keeps working.
 */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',
  // neutral[950] at half opacity, for dimming what's behind a sheet.
  scrim: 'rgba(2, 6, 23, 0.5)',
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  brand: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    950: '#1E1B4B',
  },
  red: { 400: '#F87171', 600: '#DC2626' },
  green: { 400: '#4ADE80', 600: '#16A34A' },
  amber: { 400: '#FBBF24', 600: '#D97706' },
} as const;
