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

  // FETCHES ALL APPLICANTS FROM BACKEND API
  const fetchApplicants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/applicants');
      setApplicants(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // HANDLES CREATE OR UPDATE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // PREPARES DATA OBJECT FOR APO REQUEST
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
        // SENDS UPDATE REQUEST FOR EXISTING APPLICANT
        await axios.put(`http://localhost:8080/api/applicants/${editingId}`, payload);
      } else {
        // SENDS CREATE REQUEST FOR NEW APPLICANT
        await axios.post('http://localhost:8080/api/applicants', payload);
      }

      // RESETS FORM AND REFRESHES DATA
      resetForm();
      fetchApplicants(); 
    } catch (error) {
      console.error("Error saving applicant: ", error);
    }
  };

  // HANDLES DELETING AN APPLICANT
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/applicants/${id}`);
      fetchApplicants();
    } catch (error) {
      console.error("Error deleting applicant: ", error);
    }
  };

  // LOADS SELECTED APPLICANT DATA INTO FORM FOR EDITING
  const handleEditClick = (applicant) => {
    setEditingId(applicant.id);
    setName(applicant.name);
    setIncome(applicant.annualIncome);
    setCredit(applicant.creditScore);
    setLoan(applicant.loanAmount);
    setStatus(applicant.status);
    setAiClass(applicant.aiClassification);
  };

  // RESETS FORM TO DEFAULT VALUES
  const resetForm = () => {
    setEditingId(null);
    setName(''); setIncome(''); setCredit(''); setLoan('');
    setStatus('Pending'); setAiClass('Not Analyzed');
  };

  return (
    <Box>

      {/* PAGE TITLE */}
      <Typography variant="h4" color="primary.dark" fontWeight="bold" gutterBottom>
        Applicant Database
      </Typography>
      
      {/* FORM CARD FOR CREATE AND UPDATE */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2, backgroundColor: editingId ? '#fff8e1' : 'white' }}>
        <CardContent>

          {/* DYNAMIC FORM TITLE */}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {editingId ? `Editing Applicant ID: ${editingId}` : 'Add New Applicant'}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mt: 2 }}>

              {/* INPUT FIELDS */}
              <TextField label="Full Name" variant="outlined" size="small" value={name} onChange={e => setName(e.target.value)} required />
              <TextField label="Annual Income" type="number" variant="outlined" size="small" value={income} onChange={e => setIncome(e.target.value)} required />
              <TextField label="Credit Score" type="number" variant="outlined" size="small" value={credit} onChange={e => setCredit(e.target.value)} required />
              <TextField label="Loan Amount" type="number" variant="outlined" size="small" value={loan} onChange={e => setLoan(e.target.value)} required />
              
              {/* SAVE OR UPDATE BUTTON */}
              <Button type="submit" variant="contained" color={editingId ? "warning" : "primary"} startIcon={<SaveIcon />} sx={{ height: '40px' }}>
                {editingId ? 'Update' : 'Save'}
              </Button>
              
              {/* CANCEL BUTTON */}
              {editingId && (
                <Button variant="outlined" color="error" onClick={resetForm} startIcon={<CancelIcon />} sx={{ height: '40px' }}>
                  Cancel
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* TABLE DISPLAYING APPLICANTS DATA */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>

          {/* TABLE HEADER */}
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

          {/* TABLE BODY WITH DATA ROWS */}
          <TableBody>
            {applicants.map((app) => (
              <TableRow key={app.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f5f5f5' } }}>

                {/* APPLICANT DATA CELLS */}
                <TableCell>{app.id}</TableCell>
                <TableCell fontWeight="bold">{app.name}</TableCell>
                <TableCell>${app.annualIncome.toLocaleString()}</TableCell>
                <TableCell>{app.creditScore}</TableCell>
                <TableCell>${app.loanAmount.toLocaleString()}</TableCell>

                {/* AI STATUS WITH COLOR INDICATOR */}
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
                  <IconButton color="primary" onClick={() => handleEditClick(app)} title="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(app.id)} title="Delete">
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