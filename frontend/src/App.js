import React, { useState } from 'react';
import Auth from './components/Auth';

// MAIN APPLICATION COMPONENT CONTROLLING LOGIN STATE AND VIEW RENDERING
function App() {

  // STORES CURRENTLY LOGGED IN USER
  const [loggedInUser, setLoggedInUser] = useState(null);

  // SHOW AUTH SCREEN IF USER IS NOT LOGGED IN
  if (!loggedInUser) {
    return <Auth onLoginSuccess={setLoggedInUser} />;
  }

  // SHOW DASHBOARD IF USER IS LOGGED IN
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Atlas Financial, {loggedInUser}!</h1>

      // BASIC DASHBOARD PLACEHOLDER
      <p>Dashbord</p>

      // LOGOUT BUTTON RESETS USER STATE
      <button onClick={() => setLoggedInUser(null)}>Log Out</button>
    </div>
  );
}

export default App;