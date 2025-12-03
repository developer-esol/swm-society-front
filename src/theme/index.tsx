import { createTheme } from '@mui/material/styles';

// Custom color palette for reusable colors
export const colors = {
  button: {
    primary: '#dc2626',
    primaryHover: '#b91c1c',
    primaryDisabled: '#9ca3af',
  },
  text: {
    primary: '#000000',
    secondary: '#ffffff',
    disabled: '#6b7280',
    dark: '#1f2937',
    gray: '#374151',
    lightGray: '#666',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    light: '#f9fafb',
    lighter: '#f3f4f6',
  },
  border: {
    default: '#e5e7eb',
    light: '#e0e0e0',
  },
  input: {
    bg: '#ffffff',
  },
  icon: {
    primary: '#d32f2f',
  },
  overlay: {
    dark: '#000000',
    darkHover: '#1a1a1a',
    darkHoverLight: '#333333',
    gray: '#cccccc',
  },
  loyalty: {
    primary: '#ea580c',
    secondary: '#b45309',
    tertiary: '#92400e',
    yellow: '#fff8cbff',
    lightRed: '#fef2f2',
    lightRedPink: '#fecaca',
    lightRedPinkHover: '#fca5a5',
    darkRed: '#7f1d1d',
    green: '#10b981',
    greenDark: '#059669',
    orange: '#d97706',
    lightGreen: '#d1fae5',
    lightOrange: '#fef5e7',
    yellowBorder: '#fcd34d',
  },
  // Status Colors
  status: {
    delivered: '#10b981',        // Green
    shipped: '#f59e0b',          // Amber
    processing: '#3b82f6',       // Blue
    cancelled: '#ef4444',        // Red
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.text.primary,
      contrastText: colors.text.secondary,
    },
    secondary: {
      main: colors.text.secondary,
      contrastText: colors.text.primary,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.text.primary,
          color: colors.text.secondary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: colors.button.primary,
          color: colors.text.secondary,
          '&:hover': {
            backgroundColor: colors.button.primaryHover,
          },
          '&:disabled': {
            backgroundColor: colors.button.primaryDisabled,
            color: colors.text.secondary,
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: colors.button.primary,
            color: colors.text.secondary,
            '&:hover': {
              backgroundColor: colors.button.primaryHover,
            },
            '&:disabled': {
              backgroundColor: colors.button.primaryDisabled,
              color: colors.text.secondary,
            },
          },
        },
      ],
    },
  },
});