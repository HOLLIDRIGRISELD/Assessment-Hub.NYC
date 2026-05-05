import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Card, CardContent, TextField, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// MAIN COMPONENT FOR DISPLAYING AND MANAGING APPLICANTS
function ApplicantsTab() {

  // STORES LIST OF APPLICANTS FROM BACKEND
  const [applicants, setApplicants] = useState([]);
  
  // STORES FORM INPUT VALUES
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [credit, setCredit] = useState('');
  const [loan, setLoan] = useState('');
  const [status, setStatus] = useState('Pending');
  const [aiClass, setAiClass] = useState('Not Analyzed');

  // TRACKS EDIT MODE USING APPLICANT ID
  const [editingId, setEditingId] = useState(null);

  // LOADS APPLICANTS DATA ON COMPONENT MOUNT
  useEffect(() => {
    fetchApplicants();
  }, []);

  // HANDLES ALL API REQUESTS WITH FAILOVER BETWEEN DROPLET AND LOCALHOST
  const smartRequest = async (method, endpoint, data = null) => {
    let finalResponse = null;

    try {
      // ATTEMPTS REQUEST TO REMOTE SERVER
      finalResponse = await axios({
        method: method,
        url: `http://206.81.22.189:8080${endpoint}`,
        data: data
      });

    } catch (dropletError) {

      // FALLBACK TO LOCAL SERVER IF REMOTE FAILS
      console.warn(`Droplet unreachable for ${method}. Trying Localhost...`);
      try {
        finalResponse = await axios({
          method: method,
          url: `http://localhost:8080${endpoint}`,
          data: data
        });
      } catch (localError) {
        console.error(`Both servers down for ${endpoint}`);
        throw localError;
      }

    } finally {
      // LOGS COMPLETION OF NETWORK REQUEST
      console.log(`Network request (${method}) to ${endpoint} finished.`);
    }

    return finalResponse;
  };

  // FETCHES ALL APPLICANTS FROM BACKEND
  const fetchApplicants = async () => {
    try {
      const response = await smartRequest('GET', '/api/applicants');
      if (response) setApplicants(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // HANDLES CREATE OR UPDATE OF APPLICANT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      annualIncome: parseFloat(income),
      creditScore: parseInt(credit),
      loanAmount: parseFloat(loan),
      status,
      aiClassification: aiClass
    };

    try {
      if (editingId) {
        // UPDATES EXISTING APPLICANT
        await smartRequest('PUT', `/api/applicants/${editingId}`, payload);
      } else {
        // CREATES NEW APPLICANT
        await smartRequest('POST', '/api/applicants', payload);
      }
      
      // RESETS FORM AND REFRESHES DATA
      resetForm();
      fetchApplicants(); 
    } catch (error) {
      console.error("Error saving applicant: ", error);
    }
  };

  // DELETES APPLICANT BY ID
  const handleDelete = async (id) => {
    try {
      await smartRequest('DELETE', `/api/applicants/${id}`);
      fetchApplicants();
    } catch (error) {
      console.error("Error deleting applicant: ", error);
    }
  };

  // LOADS SELECTED APPLICANT INTO FORM FOR EDITING
  const handleEditClick = (applicant) => {
    setEditingId(applicant.id);
    setName(applicant.name);
    setIncome(applicant.annualIncome);
    setCredit(applicant.creditScore);
    setLoan(applicant.loanAmount);
    setStatus(applicant.status);
    setAiClass(applicant.aiClassification);
  };

  // RESETS FORM TO DEFAULT STATE
  const resetForm = () => {
    setEditingId(null);
    setName('');
    setIncome('');
    setCredit('');
    setLoan('');
    setStatus('Pending');
    setAiClass('Not Analyzed');
  };

  return (
    <Box>

      {/* DISPLAYS PAGE TITLE */}
      <Typography variant="h4" color="primary.dark" fontWeight="bold" gutterBottom>
        Applicant Database
      </Typography>
      
      {/* FORM CARD FOR ADDING OR EDITING APPLICANTS */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2, backgroundColor: editingId ? '#fff8e1' : 'white' }}>
        <CardContent>

          {/* SHOWS CURRENT MODE (ADD OR EDIT) */}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {editingId ? `Editing Applicant ID: ${editingId}` : 'Add New Applicant'}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mt: 2 }}>

              {/* INPUT FIELDS FOR APPLICANT DATA */}
              <TextField label="Full Name" size="small" value={name} onChange={e => setName(e.target.value)} required />
              <TextField label="Annual Income" type="number" size="small" value={income} onChange={e => setIncome(e.target.value)} required />
              <TextField label="Credit Score" type="number" size="small" value={credit} onChange={e => setCredit(e.target.value)} required />
              <TextField label="Loan Amount" type="number" size="small" value={loan} onChange={e => setLoan(e.target.value)} required />
              
              {/* BUTTON TO SAVE OR UPDATE APPLICANT */}
              <Button type="submit" variant="contained" color={editingId ? "warning" : "primary"} startIcon={<SaveIcon />} sx={{ height: '40px' }}>
                {editingId ? 'Update' : 'Save'}
              </Button>
              
              {/* BUTTON TO CANCEL EDIT MODE */}
              {editingId && (
                <Button variant="outlined" color="error" onClick={resetForm} startIcon={<CancelIcon />} sx={{ height: '40px' }}>
                  Cancel
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* TABLE DISPLAYING ALL APPLICANTS */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>

          {/* TABLE HEADER ROW */}
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Income</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Credit Score</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Loan Request</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>AI Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* TABLE BODY WITH DYNAMIC DATA */}
          <TableBody>
            {applicants.map((app) => (
              <TableRow key={app.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>

                {/* DISPLAYS APPLICANT DATA */}
                <TableCell>{app.id}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{app.name}</TableCell>
                <TableCell>${app.annualIncome.toLocaleString()}</TableCell>
                <TableCell>{app.creditScore}</TableCell>
                <TableCell>${app.loanAmount.toLocaleString()}</TableCell>

                {/* DISPLAYS AI STATUS WITH COLOR CODING */}
                <TableCell align="center">
                  <Chip 
                    label={app.aiClassification} 
                    color={
                      app.aiClassification === 'Approved' ? 'success' : 
                      app.aiClassification === 'Denied' ? 'error' : 'default'
                    }
                    variant={app.aiClassification === 'Not Analyzed' ? 'outlined' : 'filled'}
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>

                {/* ACTION BUTTONS FOR EDIT AND DELETE */}
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEditClick(app)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(app.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}

export default ApplicantsTab;