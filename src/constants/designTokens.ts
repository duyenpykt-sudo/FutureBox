/**
 * @deprecated Backward-compat shim. Import design tokens from './theme' instead.
 *
 * This maps the legacy light/indigo token names to the new dark-glass theme so
 * existing components keep working during the UI redesign. Migrate usages to
 * `theme.ts` (colors.accent, colors.bgBase, colors.glassSurface, ...) over time.
 */
import { colors as t } from './theme';

export { spacing, radius, shadow, typography, animation } from './theme';

export const colors = {
  primary: t.accent,
  primaryLight: t.accentSoft,
  primaryDark: t.accentPressed,
  background: t.bgBase,
  surface: t.glassSurface,
  textPrimary: t.textPrimary,
  textSecondary: t.textSecondary,
  border: t.glassBorder,
  success: t.success,
  danger: t.danger,
  warning: t.warning,
} as const;
