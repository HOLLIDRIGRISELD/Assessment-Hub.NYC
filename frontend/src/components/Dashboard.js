import React, { useState } from 'react';
import ApplicantsTab from './ApplicantsTab';
import DashboardTab from './DashboardTab';

// MAIN DASHBOARD COMPONENT WITH TAB-BASED NAVIGATION
function Dashboard({ username, onLogout }) {

  // TRACKS CURRENTLY SELECTED DASHBOARD TAB (Changed default to 'dashboard')
  const [activeTab, setActiveTab] = useState('dashboard');

  // RENDERS CONTENT BASED ON ACTIVE TAB SELECTION
  const renderContent = () => {
    switch (activeTab) {

      // DISPLAYS THE MAIN DASHBOARD TAB
      case 'dashboard':
        return <DashboardTab />;

      // DISPLAYS APPLICANT DATABASE SECTION
      case 'applicants':
        return <ApplicantsTab />;

      // DISPLAYS AI UNDERWRITER SECTION
      case 'ai':
        return <div><h2> AI Underwriter</h2><p>Python AI connection will go here.</p></div>;

      // DISPLAYS USER SETTINGS AND LOGOUT OPTION
      case 'settings':
        return (
          <div>
            <h2> Officer Settings</h2>
            <p>Logged in as: <strong>{username}</strong></p>
            <button onClick={onLogout} style={{ marginTop: '10px', color: 'red' }}>
              Secure Log Out
            </button>
          </div>
        );

      // DEFAULT FALLBACK IF NO TAB IS SELECTED
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>

      {/* SIDEBAR CONTAINING NAVIGATION BUTTONS */}
      <div style={{ width: '200px', borderRight: '2px solid black', padding: '20px' }}>
        <h3>Atlas Financial</h3>
        <hr />

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          
          {/* SWITCHES TO MAIN DASHBOARD TAB */}
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('dashboard')} disabled={activeTab === 'dashboard'}>
              Dashboard
            </button>
          </li>

          {/* SWITCHES TO APPLICANTS TAB */}
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('applicants')} disabled={activeTab === 'applicants'}>
              Applicant Database
            </button>
          </li>

          {/* SWITCHES TO AI TAB */}
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('ai')} disabled={activeTab === 'ai'}>
              AI Underwriter
            </button>
          </li>

          {/* SWITCHES TO SETTINGS TAB */}
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('settings')} disabled={activeTab === 'settings'}>
              Settings
            </button>
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT AREA THAT DISPLAYS SELECTED TAB */}
      <div style={{ flex: 1, padding: '20px' }}>
        {renderContent()}
      </div>

    </div>
  );
}

export default Dashboard;