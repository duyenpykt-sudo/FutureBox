/**
 * FutureBoxes Design Tokens — single source of truth.
 * Style: Dark Glassmorphism + Orange Accent. See design/uiuxguides.md.
 *
 * New code should import from this file. The legacy `designTokens.ts` re-exports
 * these tokens with backward-compatible aliases.
 */

export const colors = {
  // Accent (orange) — actions & active states only
  accent: '#FF5A1F',
  accentPressed: '#E04A12',
  accentSoft: 'rgba(255,90,31,0.16)',

  // Background (dark)
  bgBase: '#0E0F12',
  bgGradient: ['#14161B', '#0A0B0D'] as const, // top -> bottom
  bgOverlay: 'rgba(8,9,11,0.55)', // dim layer over background photos

  // Glass surfaces
  glassSurface: 'rgba(255,255,255,0.08)',
  glassSurfaceStrong: 'rgba(255,255,255,0.12)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassHighlight: 'rgba(255,255,255,0.22)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.64)',
  textTertiary: 'rgba(255,255,255,0.40)',
  divider: 'rgba(255,255,255,0.10)',

  // Semantic
  success: '#34C759',
  danger: '#FF4D4F',
  warning: '#FFB020',
} as const;

/** Per box-type hues (distinct on dark glass), matches BOX_TYPES. */
export const boxTypeColors = {
  letter: '#FF5A1F', // Cam (accent)
  goal: '#2DD4BF', // Teal
  memory: '#A78BFA', // Tím
  decision: '#60A5FA', // Xanh thép
} as const;

export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, letterSpacing: -0.2 },
  h1: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.2 },
  h2: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
} as const;

/** 8pt grid. `screenMargin` = horizontal screen padding. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screenMargin: 20,
} as const;

export const radius = {
  input: 12,
  chip: 12,
  button: 16,
  card: 24,
  pill: 999,
  fab: 999,
} as const;

/** Glass card recipe — use with expo-blur <BlurView>. */
export const glass = {
  blurTint: 'dark' as const,
  blurIntensity: 30, // 24–40 range; use 40 for modals/strong cards
  blurIntensityStrong: 40,
  surface: colors.glassSurface,
  surfaceStrong: colors.glassSurfaceStrong,
  border: colors.glassBorder,
  borderWidth: 1,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const animation = {
  press: 160, // 120–200ms micro-interactions
  transition: 250, // 200–300ms focus/fade
  screen: 300,
  unlock: 1500, // Open Box reveal
  confetti: 2500,
} as const;

export const theme = {
  colors,
  boxTypeColors,
  typography,
  spacing,
  radius,
  glass,
  shadow,
  animation,
} as const;

export default theme;
