import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MavsStats from './pages/MavsStats';
import MavsScouts from './pages/MavsScouts';
import Operations from './pages/Operations';
import './App.css';

// Create a retro-tech theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00538C', // Mavericks blue
      light: '#1A6BA1',
      dark: '#003B63',
    },
    secondary: {
      main: '#B8C4CA', // Mavericks silver
      light: '#D1D9DF',
      dark: '#8A949A',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Roboto", sans-serif',
    },
    body2: {
      fontFamily: '"Roboto", sans-serif',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #00538C 0%, #1A6BA1 100%)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease-in-out',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Roboto", sans-serif',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <div style={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
          }}>
            <Header />
            <main style={{ 
              flex: 1,
              width: '100%',
              maxWidth: '100vw',
              overflowX: 'hidden',
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stats" element={<MavsStats />} />
                <Route path="/scouts" element={<MavsScouts />} />
                <Route path="/operations" element={<Operations />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
