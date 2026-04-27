import React, { useState } from 'react';
import ApplicantsTab from './ApplicantsTab';
import AiTab from './AiTab';
import DashboardTab from './DashboardTab';

// MAIN DASHBOARD COMPONENT WITH TAB-BASED NAVIGATION
function Dashboard({ username, onLogout }) {

  // TRACKS CURRENTLY ACTIVE TAB (DEFAULT SET TO DASHBOARD)
  const [activeTab, setActiveTab] = useState('dashboard');

  // SELECTS AND RENDERS CONTENT BASED ON ACTIVE TAB
  const renderContent = () => {
    switch (activeTab) {

      // DISPLAYS MAIN DASHBOARD WITH LIVE DATA
      case 'dashboard':
        return <DashboardTab />;

      // DISPLAYS APPLICANT MANAGEMENT INTERFACE
      case 'applicants':
        return <ApplicantsTab />;

      // DISPLAYS PLACEHOLDER FOR AI FEATURE
      case 'ai':
        return <AiTab />;

      // DISPLAYS USER INFO AND LOGOUT OPTION
      case 'settings':
        return (
          <div>
            <h2> Officer Settings</h2>
            <p>Logged in as: <strong>{username}</strong></p>

            {/* TRIGGERS USER LOGOUT */}
            <button onClick={onLogout} style={{ marginTop: '10px', color: 'red' }}>
              Secure Log Out
            </button>
          </div>
        );

      // FALLBACK CONTENT IF NO TAB MATCHES
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>

      {/* SIDEBAR NAVIGATION MENU */}
      <div style={{ width: '200px', borderRight: '2px solid black', padding: '20px' }}>
        <h3>Atlas Financial</h3>
        <hr />

        <ul style={{ listStyleType: 'none', padding: 0 }}>

          {/* BUTTON TO OPEN DASHBOARD TAB */}
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('dashboard')} disabled={activeTab === 'dashboard'}>
              Dashboard
            </button>
          </li>

          {/* BUTTON TO OPEN APPLICANTS TAB */}
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('applicants')} disabled={activeTab === 'applicants'}>
              Applicant Database
            </button>
          </li>

          {/* BUTTON TO OPEN AI TAB */}
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('ai')} disabled={activeTab === 'ai'}>
              AI Underwriter
            </button>
          </li>

          {/* BUTTON TO OPEN SETTINGS TAB */}
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('settings')} disabled={activeTab === 'settings'}>
              Settings
            </button>
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT DISPLAY AREA */}
      <div style={{ flex: 1, padding: '20px' }}>
        {renderContent()}
      </div>

    </div>
  );
}

export default Dashboard;