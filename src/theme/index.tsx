import { createTheme } from '@mui/material/styles';

// Custom color palette for reusable colors
export const colors = {
  button: {
    primary: '#dc2626',
    primaryHover: '#b91c1c',
    primaryDisabled: '#9ca3af',
    new: '#C62C2B',
    dark : '#A82421',
  },
  text: {
    primary: '#000000',
    secondary: '#ffffff',
    disabled: '#6b7280',
    dark: '#1f2937',
    gray: '#374151',
    lightGray: '#666',
    new: '#3c4043',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    box: '#fafafa',
    light: '#f9fafb',
    lighter: '#f3f4f6',
    new: '#f0f0f0',
    login: '#f1f3f4',
    register: '#f8f9fa',
  },
  order: {
    orange: '#ea580c',
    blue: '#3b82f6',
    red: '#dc2626',
    black: '#000000',
    white: '#ffffff',
    green: '#10b981',
    purple: '#a855f7',
  },
  border: {
    default: '#e5e7eb',
    light: '#e0e0e0',
    grey: '#bdbdbd',
  },
  input: {
    bg: '#ffffff',
    border: '#e0e0e0',
    placeholderText: '#999999',
    searchIconColor: '#e74c3c',
  },
  points: {
    primary: '#ff4d4d',
    earned: '#dcfce7',
    redeemed: '#fef3c7',
    adjustment:'#dbeafe',
    default:'#f3f4f6',
  },
  icon: {
    primary: '#d32f2f',
  },
  overlay: {
    dark: '#000000',
    darkHover: '#1a1a1a',
    darkHoverLight: '#333333',
    gray: '#cccccc',
    white: 'rgba(255, 255, 255, 0.9)',
    whiteOpaque: 'rgba(255, 255, 255, 1)',
    blackLight: 'rgba(0,0,0,0.15)',
  },
  password: {
    primary: '#10b981',
    secondary: '#999999',
    disable: '#9e9e9e',
  },
  login: {
    primary: '#3c4043',
    blue: '#4285F4',
    green: '#34A853',
    yellow: '#FBBC05',
    red: '#EA4335',
    access: '#d3d3d3'
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
    grey: '#6b7280',
    box: '#ffe6e6',
    yellownew:'#ff8c00',
    points:'#e6f7f0',
    pointissue:'#00b386',
  },
  adminloyalty: {
    yellow: '#FFD700',
    yellownew: '#FFA500'
  },
  // Status Colors
  status: {
    delivered: '#10b981',        // Green
    shipped: '#f59e0b',          // Amber
    processing: '#3b82f6',       // Blue
    cancelled: '#ef4444',        // Red
    success: '#10b981',          // Green for eligible
    error: '#dc2626', 
    box: '#E53935' ,          // Red for not eligible
  },
  // Card Colors
  card: {
    background: '#ffffff',
    imagePlaceholder: '#f5f5f5',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowHover: 'rgba(0, 0, 0, 0.12)',
  },
  // Error/Danger Colors
  danger: {
    primary: '#dc2626',
    background: '#fee2e2',
    backgroundHover: '#fecaca',
    info: '#3d3939ff',
    yellow: '#FFC107',
    role: '#e5e5e5'
  },
  // Chart Colors
  chart: {
    primary: '#000000',          // Direct - Black
    secondary: '#3b82f6',        // Shift Monkey - Blue
    tertiary: '#10b981',         // Returned - Green
    quaternary: '#f59e0b',       // Failed - Amber
  },
  // Menu/Dropdown Colors
  menu: {
    background: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    hover: '#f1dedeff',
    selected: '#c8cbceff',
    selectedHover: '#aab5beff',
    border: '#b9babdff',
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
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.menu.background,
          border: `1px solid ${colors.menu.border}`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: colors.menu.text,
          '&:hover': {
            backgroundColor: colors.menu.hover,
            color: colors.menu.text,
          },
          '&.Mui-selected': {
            backgroundColor: colors.menu.selected,
            color: colors.menu.text,
            '&:hover': {
              backgroundColor: colors.menu.selectedHover,
            },
          },
          '& em': {
            color: colors.menu.textSecondary,
          },
        },
      },
    },
  },
});