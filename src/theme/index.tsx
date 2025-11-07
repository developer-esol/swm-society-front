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
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
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