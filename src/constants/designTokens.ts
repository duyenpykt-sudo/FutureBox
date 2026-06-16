export const colors = {
  primary: '#6366F1',
  primaryLight: '#E0E7FF',
  primaryDark: '#4F46E5',
  background: '#F5F5F7',
  surface: '#FFFFFF',
  textPrimary: '#18181B',
  textSecondary: '#71717A',
  border: '#E4E4E7',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
} as const;

export const typography = {
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  button: 8,
  card: 12,
  fab: 28,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
} as const;

export const animation = {
  transition: 250,
  unlock: 1500,
  confetti: 2500,
} as const;
