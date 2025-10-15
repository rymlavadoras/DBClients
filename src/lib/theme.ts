// =================================
// TEMA MATERIAL-UI CON DARK MODE
// =================================

'use client';

import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme(
    {
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? '#90caf9' : '#1976d2',
          light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
          dark: mode === 'dark' ? '#42a5f5' : '#1565c0',
        },
        secondary: {
          main: mode === 'dark' ? '#f48fb1' : '#dc004e',
          light: mode === 'dark' ? '#ffc1e3' : '#f50057',
          dark: mode === 'dark' ? '#bf5f82' : '#c51162',
        },
        success: {
          main: mode === 'dark' ? '#66bb6a' : '#2e7d32',
          light: mode === 'dark' ? '#81c784' : '#4caf50',
          dark: mode === 'dark' ? '#388e3c' : '#1b5e20',
        },
        warning: {
          main: mode === 'dark' ? '#ffa726' : '#ed6c02',
          light: mode === 'dark' ? '#ffb74d' : '#ff9800',
          dark: mode === 'dark' ? '#f57c00' : '#e65100',
        },
        info: {
          main: mode === 'dark' ? '#29b6f6' : '#0288d1',
          light: mode === 'dark' ? '#4fc3f7' : '#03a9f4',
          dark: mode === 'dark' ? '#0277bd' : '#01579b',
        },
        error: {
          main: mode === 'dark' ? '#f44336' : '#d32f2f',
          light: mode === 'dark' ? '#e57373' : '#ef5350',
          dark: mode === 'dark' ? '#c62828' : '#c62828',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#f5f5f5',
          paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
          secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
        divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ].join(','),
        h1: {
          fontSize: '2.5rem',
          fontWeight: 600,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600,
        },
        h3: {
          fontSize: '1.75rem',
          fontWeight: 600,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 600,
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 600,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
              fontWeight: 500,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: mode === 'dark' 
                ? '0 2px 8px rgba(0,0,0,0.5)' 
                : '0 2px 8px rgba(0,0,0,0.1)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            variant: 'outlined',
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    },
    esES // Locales en español
  );
