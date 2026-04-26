import React, { useState } from 'react';
import axios from 'axios';

// HANDLES USER AUTHENTICATION UI
function Auth({ onLoginSuccess }) {

  // STORES AUTH MODE
  const [isLogin, setIsLogin] = useState(true);

  // STORES USER INPUT VALUES
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // STORES FEEDBACK MESSAGE FROM SERVER
  const [message, setMessage] = useState('');

  // HANDLES FORM SUBMISSION AND BACKEND COMMUNICATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // SELECTS BACKEND ENDPOINT BASED ON MODE
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      // SENDS LOGIN OR REGISTER REQUEST TO BACKEND
      const response = await axios.post(`http://localhost:8080${endpoint}`, {
        username: username,
        password: password
      });

      setMessage(response.data);

      // GRANTS ACCESS IF LOGIN IS SUCCESSFUL
      if (isLogin && response.data === "Login successful") {
        onLoginSuccess(username);
      }

    } catch (error) {
      // HANDLES SERVER OR VALIDATION ERRORS
      setMessage(error.response?.data || "An error occurred connecting to the server.");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid black', maxWidth: '300px' }}>

      {/* DISPLAYS CURRENT AUTH MODE */}
      <h2>{isLogin ? 'Officer Login' : 'Register New Officer'}</h2>

      <form onSubmit={handleSubmit}>

        {/* USERNAME INPUT FIELD */}
        <div style={{ marginBottom: '10px' }}>
          <label>Username: </label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD INPUT FIELD */}
        <div style={{ marginBottom: '10px' }}>
          <label>Password: </label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* SUBMIT BUTTON FOR LOGIN OR REGISTER */}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>

      {/* DISPLAYS RESPONSE MESSAGE */}
      <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>

      <hr />

      {/* TOGGLES BETWEEN LOGIN AND REGISTER MODES */}
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
}

export default Auth;