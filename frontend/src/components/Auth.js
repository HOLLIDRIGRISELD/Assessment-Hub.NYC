// IMPORT REACT HOOKS AND REQUIRED LIBRARIES
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment } from '@mui/material';

// IMPORT ICONS FOR UI ENHANCEMENT
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

// AUTH COMPONENT HANDLING LOGIN AND REGISTRATION LOGIC
function Auth({ onLoginSuccess }) {

  // STORE CURRENT MODE (LOGIN OR REGISTER)
  const [isLogin, setIsLogin] = useState(true);

  // STORE USER INPUT DATA
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // STORE RESPONSE MESSAGE FROM SERVER
  const [message, setMessage] = useState('');

  // HANDLE FORM SUBMISSION AND SERVER COMMUNICATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // DETERMINE API ENDPOINT BASED ON MODE
    const endpoint = isLogin ? '/login' : '/register';
    let response = null;

    try {
      // ATTEMPT AUTHENTICATION USING REMOTE SERVER
      response = await axios.post(`http://206.81.22.189:8080/api/auth${endpoint}`, {
        username: username,
        password: password
      });

    } catch (dropletError) {

      // HANDLE CASE WHERE REMOTE SERVER RESPONDS WITH ERROR
      if (dropletError.response) {
        setMessage(dropletError.response.data);
        return;
      }

      // FALLBACK TO LOCAL SERVER IF REMOTE IS UNREACHABLE
      console.warn("Droplet unreachable. Trying Localhost...");
      try {
        response = await axios.post(`http://localhost:8080/api/auth${endpoint}`, {
          username: username,
          password: password
        });
      } catch (localError) {

        // HANDLE LOCAL SERVER FAILURE
        if (localError.response) {
          setMessage(localError.response.data);
        } else {
          setMessage("Server error. Both Droplet and Localhost are down.");
        }
        return;
      }

    } finally {
      // LOG COMPLETION OF AUTH ATTEMPT
      console.log(`Authentication attempt for ${username} finished.`);
    }

    // HANDLE SUCCESSFUL RESPONSE
    if (response) {
      setMessage(response.data);

      // REDIRECT USER AFTER SUCCESSFUL LOGIN
      if (isLogin) {
        setTimeout(() => {
          onLoginSuccess(username);
        }, 500);
      }
    }
  };

  return (

    // MAIN FULLSCREEN CONTAINER
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'primary.main' 
      }}
    >

      {/* AUTHENTICATION CARD UI */}
      <Card 
        sx={{ 
          maxWidth: 400, 
          width: '100%', 
          p: 2, 
          borderRadius: 4, 
          boxShadow: 6, 
          backgroundColor: 'rgba(255, 255, 255, 0.9)' 
        }}
      >

        {/* CARD CONTENT AREA */}
        <CardContent sx={{ textAlign: 'center' }}>

          {/* APPLICATION TITLE */}
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="primary.dark" 
            gutterBottom 
            sx={{ letterSpacing: 2, mb: 4 }}
          >
            WELCOME
          </Typography>

          {/* AUTHENTICATION FORM */}
          <form onSubmit={handleSubmit}>

            {/* USERNAME INPUT FIELD */}
            <TextField 
              fullWidth 
              variant="outlined" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
              sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* PASSWORD INPUT FIELD */}
            <TextField 
              fullWidth 
              type="password" 
              variant="outlined" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              sx={{ mb: 3, backgroundColor: 'white', borderRadius: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* SUBMIT BUTTON */}
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={isLogin ? <LoginIcon /> : <AppRegistrationIcon />}
              sx={{ borderRadius: 8, py: 1.5, mb: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              {isLogin ? 'Login' : 'Register'}
            </Button>

          </form>

          {/* TOGGLE BETWEEN LOGIN AND REGISTER MODES */}
          <Button 
            color="secondary" 
            onClick={() => setIsLogin(!isLogin)} 
            sx={{ textTransform: 'none', color: 'primary.dark' }}
          >
            {isLogin ? "Need an account? Register here" : "Already have an account? Login"}
          </Button>

          {/* DISPLAY SERVER RESPONSE MESSAGE */}
          {message && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                color: message.includes('Error') ? 'error.main' : 'success.main', 
                fontWeight: 'bold' 
              }}
            >
              {message}
            </Typography>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}

// EXPORT COMPONENT FOR USE IN APP
export default Auth;