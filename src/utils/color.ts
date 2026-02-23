import { lightTheme } from '../theme/theme';

/** @deprecated Use `useTheme()` hook instead */
export const colors = {
    primary: lightTheme.colors.primary,
    dark: lightTheme.colors.textPrimary,
    lightGrey: lightTheme.colors.border,
    darkGrey: lightTheme.colors.textSecondary,
    white: lightTheme.colors.surface,
};
