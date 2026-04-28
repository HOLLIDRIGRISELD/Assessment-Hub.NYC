import React, { useState } from 'react';
import { 
  Box, Typography, Card, Button, Divider, 
  Switch, FormControlLabel, Avatar, TextField, Tabs, Tab 
} from '@mui/material';

// Icons used in the settings UI
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';

// Tab panel helper component for conditional rendering
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other} style={{ width: '100%' }}>
      {value === index && <Box sx={{ p: 4 }}>{children}</Box>}
    </div>
  );
}

// Main Settings component
function SettingsTab({ username, onLogout }) {

  // Active tab state
  const [activeTab, setActiveTab] = useState(0);

  // Notification settings states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Security setting state (2FA toggle) (NOT REALLY WORIKING)
  const [twoFactor, setTwoFactor] = useState(true);

  // Handles tab switching
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    // Main page container
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

      {/* Page title */}
      <Typography variant="h4" color="primary.dark" fontWeight="bold" gutterBottom>
        Officer Settings
      </Typography>

      {/* Page subtitle */}
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account preferences securely.
      </Typography>

      {/* Main settings card */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, minHeight: '500px', display: 'flex', flexDirection: 'column' }}>

        {/* Tabs navigation */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f8f9fa' }}
        >

          {/* Profile tab */}
          <Tab icon={<AccountCircleIcon />} iconPosition="start" label="Profile" />

          {/* Security tab */}
          <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />

          {/* Alerts tab */}
          <Tab icon={<NotificationsActiveIcon />} iconPosition="start" label="Alerts" />

          {/* Session tab */}
          <Tab icon={<LogoutIcon />} iconPosition="start" label="Session" />

        </Tabs>

        {/* PROFILE TAB CONTENT */}
        <TabPanel value={activeTab} index={0}>

          {/* Section title */}
          <Typography variant="h5" fontWeight="bold" color="primary.dark" gutterBottom>
            Profile Information
          </Typography>

          {/* Divider line */}
          <Divider sx={{ mb: 4 }} />

          {/* User info section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>

            {/* User avatar */}
            <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mr: 3 }}>
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </Avatar>

            {/* Username*/}
            <Box>
              <Typography variant="h4" fontWeight="bold">{username}</Typography>
              <Typography variant="h6" color="text.secondary">
                Senior Loan Officer
              </Typography>
            </Box>

          </Box>

          {/* Profile form */}
          <Box sx={{ maxWidth: '500px' }}>

            {/* Email field */}
            <TextField fullWidth label="Email Address" defaultValue={`${username}@assess-ai.com`} sx={{ mb: 3 }} />

            {/* Department field */}
            <TextField fullWidth label="Department" defaultValue="Underwriting & Risk" disabled sx={{ mb: 3 }} />

            {/* Save button */}
            <Button variant="contained" startIcon={<SaveIcon />}>
              Save Profile Changes
            </Button>

          </Box>
        </TabPanel>

        {/* SECURITY TAB CONTENT */}
        <TabPanel value={activeTab} index={1}>

          {/* Section title */}
          <Typography variant="h5" fontWeight="bold" color="primary.dark" gutterBottom>
            Account Security
          </Typography>

          {/* Divider */}
          <Divider sx={{ mb: 4 }} />

          <Box sx={{ maxWidth: '500px' }}>

            {/* 2FA section title */}
            <Typography variant="h6">Two-Factor Authentication</Typography>

            {/* 2FA toggle */}
            <FormControlLabel 
              control={<Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />}
              label={twoFactor ? "2FA ENABLED" : "2FA DISABLED"}
            />

            {/* Password section title */}
            <Typography variant="h6" sx={{ mt: 3 }}>Password Management</Typography>

            {/* Password update button */}
            <Button variant="outlined">Update Password</Button>

          </Box>
        </TabPanel>

        {/* ALERTS TAB CONTENT */}
        <TabPanel value={activeTab} index={2}>

          {/* Section title */}
          <Typography variant="h5" fontWeight="bold">Alerts & Notifications</Typography>

          {/* Toggles container */}
          <Box sx={{ mt: 3 }}>

            {/* Email alerts toggle */}
            <FormControlLabel 
              control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />}
              label="Email Alerts"
            />

            {/* SMS alerts toggle */}
            <FormControlLabel 
              control={<Switch checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />}
              label="SMS Alerts"
            />

          </Box>
        </TabPanel>

        {/* SESSION TAB CONTENT */}
        <TabPanel value={activeTab} index={3}>

          {/* Section title */}
          <Typography variant="h4" color="error.dark" fontWeight="bold">
            Session Management
          </Typography>

          {/* Logout button */}
          <Button variant="contained" color="error" onClick={onLogout}>
            Secure Logout
          </Button>

        </TabPanel>

      </Card>
    </Box>
  );
}

export default SettingsTab;