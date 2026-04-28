import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Button } from '@mui/material';

// IMPORTS ICONS FOR SIDEBAR NAVIGATION
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

// IMPORTS TAB COMPONENTS FOR EACH SECTION
import DashboardTab from './DashboardTab';
import ApplicantsTab from './ApplicantsTab';
import AiTab from './AiTab';
import SettingsTab from './SettingsTab';

// DEFINES FIXED WIDTH FOR SIDEBAR
const drawerWidth = 260;

// MAIN DASHBOARD COMPONENT WITH SIDEBAR NAVIGATION
function Dashboard({ username, onLogout }) {

  // TRACKS CURRENTLY ACTIVE TAB
  const [activeTab, setActiveTab] = useState('dashboard');

  // RENDERS CONTENT BASED ON SELECTED TAB
  const renderContent = () => {
    switch (activeTab) {

      // DISPLAYS MAIN DASHBOARD VIEW
      case 'dashboard': return <DashboardTab />;

      // DISPLAYS APPLICANT MANAGEMENT TABLE
      case 'applicants': return <ApplicantsTab />;

      // DISPLAYS AI ANALYSIS TOOL
      case 'ai': return <AiTab />;

      // DISPLAYS USER SETTINGS AND LOGOUT OPTION
      case 'settings': return <SettingsTab username={username} onLogout={onLogout} />;

      // DEFAULT FALLBACK CONTENT
      default: return <Typography>Select a tab</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>

      {/* LEFT SIDEBAR USING MATERIAL UI DRAWER */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'primary.dark',
            color: 'white',
          },
        }}
        variant="permanent"
        anchor="left"
      >

        {/* APPLICATION TITLE / LOGO SECTION */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            Assess-AI
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

        {/* SIDEBAR NAVIGATION MENU */}
        <List sx={{ mt: 2, px: 2 }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
            { id: 'applicants', label: 'Applicant Database', icon: <PeopleIcon /> },
            { id: 'ai', label: 'AI Underwriter', icon: <PsychologyIcon /> },
            { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
          ].map((item) => (

            // RENDERS EACH NAVIGATION ITEM
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>

              <ListItemButton 
                selected={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  borderRadius: 2,

                  // STYLING FOR ACTIVE SELECTED ITEM
                  '&.Mui-selected': {
                    backgroundColor: 'secondary.main',
                    color: 'primary.dark',
                    '& .MuiListItemIcon-root': { color: 'primary.dark' }
                  },

                  // STYLING FOR HOVER EFFECT
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >

                {/* ICON DISPLAY FOR EACH TAB */}
                <ListItemIcon 
                  sx={{ 
                    color: activeTab === item.id ? 'primary.dark' : 'white', 
                    minWidth: 40 
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {/* LABEL TEXT FOR EACH TAB */}
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ fontWeight: 500 }} 
                />

              </ListItemButton>

            </ListItem>
          ))}
        </List>

      </Drawer>

      {/* MAIN CONTENT AREA DISPLAYING ACTIVE TAB */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          backgroundColor: 'background.default', 
          overflow: 'auto' 
        }}
      >
        {renderContent()}
      </Box>

    </Box>
  );
}

export default Dashboard;