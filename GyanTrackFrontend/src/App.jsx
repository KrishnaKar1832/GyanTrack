import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css';

// User's requested color palette
// ["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"]

const theme = createTheme({
  palette: {
    primary: {
      main: '#219ebc', // Blue
      light: '#8ecae6', // Light Blue
      dark: '#023047', // Dark Blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fb8500', // Orange
      light: '#ffb703', // Yellow
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Very light grey blue for clean background
      paper: '#ffffff',
    },
    text: {
      primary: '#023047', // Dark Blue text
      secondary: '#475569', // Slate grey
    },
    action: {
      active: '#219ebc',
      hover: 'rgba(33, 158, 188, 0.08)',
      selected: 'rgba(33, 158, 188, 0.16)',
    },
    divider: 'rgba(2, 48, 71, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(33, 158, 188, 0.3)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #219ebc, #023047)',
          '&:hover': {
            background: 'linear-gradient(135deg, #023047, #219ebc)',
          }
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #ffb703, #fb8500)',
          '&:hover': {
            background: 'linear-gradient(135deg, #fb8500, #ffb703)',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(2, 48, 71, 0.08)',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:before': { display: 'none' },
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          border: '1px solid rgba(2, 48, 71, 0.08)',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
