import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

// DEFINES GLOBAL UI THEME WITH COLORS, TYPOGRAPHY AND SHAPE SETTINGS
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
    },
    secondary: {
      main: '#90caf9',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

// MAIN APPLICATION COMPONENT HANDLING AUTHENTICATION FLOW
function App() {

  // CHECK LOCAL STORAGE FIRST ON BOOT
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('assess_ai_user') || null);

  // HANDLES SAVING USER TO BROWSER MEMORY
  const handleLogin = (username) => {
    localStorage.setItem('assess_ai_user', username);
    setLoggedInUser(username);
  };

  // HANDLES WIPING USER FROM BROWSER MEMORY
  const handleLogout = () => {
    localStorage.removeItem('assess_ai_user');
    setLoggedInUser(null);
  };

  return (
    // WRAPS ENTIRE APP WITH MATERIAL UI THEME
    <ThemeProvider theme={theme}>
      {/* NORMALIZES DEFAULT BROWSER STYLES */}
      <CssBaseline />

      {/* CONDITIONAL RENDERING BASED ON LOGIN STATE */}
      {!loggedInUser ? (
        // SHOWS AUTH SCREEN IF USER NOT LOGGED IN
        <Auth onLoginSuccess={handleLogin} />
      ) : (
        // SHOWS DASHBOARD IF USER IS AUTHENTICATED
        <Dashboard 
          username={loggedInUser} 
          onLogout={handleLogout} 
        />
      )}
    </ThemeProvider>
  );
}

export default App;