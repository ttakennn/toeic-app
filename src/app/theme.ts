'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1', // Dark blue
      light: '#42a5f5',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#115293',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#0d47a1',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#0d47a1',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#0d47a1',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#0d47a1',
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#0d47a1',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#0d47a1',
    },
    body1: {
      fontSize: '14px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '12px',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(13, 71, 161, 0.1)',
          borderRadius: 12,
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(13, 71, 161, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d47a1',
        },
      },
    },
    // Fix spacing conflicts với Tailwind CSS
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          '@media (max-width: 768px)': {
            padding: '8px 12px',
          },
        },
      },
    },
  },
});

export default theme;
