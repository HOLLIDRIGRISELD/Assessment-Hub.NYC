import React, { useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

// HANDLES USER AUTHENTICATION WITH LOGIN AND REGISTRATION MODES
function Auth({ onLoginSuccess }) {

  // TRACKS CURRENT AUTH LOGIN OR REGISTER
  const [isLogin, setIsLogin] = useState(true);

  // STORES USER INPUT CREDENTIALS
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // STORES SERVER RESPONSE MESSAGES
  const [message, setMessage] = useState('');

  // HANDLES FORM SUBMISSION AND BACKEND COMMUNICATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // SELECTS CORRECT ENDPOINT BASED ON MODE
    const endpoint = isLogin ? '/login' : '/register';

    try {

      // SENDS AUTH REQUEST TO BACKENT
      const response = await axios.post(`http://localhost:8080/api/auth${endpoint}`, {
        username: username,
        password: password
      });

      // DISPLAYS SUCESS MESSAGE FROM SERVER
      setMessage(response.data);

      // HANDLES SUCCESSFUL LOGIN
      if (isLogin) {
        setTimeout(() => {
          onLoginSuccess(username);
        }, 500);
      }

    } catch (error) {

      // HANDLES BACKEND VALIDATION ERRORS
      if (error.response) {
        setMessage(error.response.data);
      } else {

        // HANDLES NETWORK OR SERVER FAILURE
        setMessage("Server error. Is the Java backend running?");
      }
    }
  };

  return (

    // FULLSCREEN CONTAINER WITH CENTERED AUTH CARD 
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'primary.main' 
      }}
    >

      {/* CARD CONTAINING AUTH FORM */}
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

            {/* SUBMIT BUTTON FOR LOGIN OR REGISTER */}
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

          {/* TOGGLES BETWEEN LOGIN AND REGISTER MODES */}
          <Button 
            color="secondary" 
            onClick={() => setIsLogin(!isLogin)} 
            sx={{ textTransform: 'none', color: 'primary.dark' }}
          >
            {isLogin ? "Need an account? Register here" : "Already have an account? Login"}
          </Button>

          {/* DISPLAYS FEEDBACK MESSAGE TO USER */}
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

export default Auth;