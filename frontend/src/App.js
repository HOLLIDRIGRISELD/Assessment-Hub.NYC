import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

// MAIN APPLICATION COMPONENT HANDLING AUTH FLOW AND VIEW SWITCHING
function App() {

  // STORES CURRENTLY LOGGED IN USER
  const [loggedInUser, setLoggedInUser] = useState(null);

  // DISPLAYS AUTH COMPONENT IF USER IS NOT LOGGED IN
  if (!loggedInUser) {
    return <Auth onLoginSuccess={setLoggedInUser} />;
  }

  // DISPLAYS DASHBOARD AND PASSES USER DATA AND LOGOUT FUNCTION
  return (
    <Dashboard 
      username={loggedInUser} 
      onLogout={() => setLoggedInUser(null)} 
    />
  );
}

export default App;