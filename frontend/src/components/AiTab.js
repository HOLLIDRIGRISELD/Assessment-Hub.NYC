import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, TextField, Button, CircularProgress, Divider } from '@mui/material';

// ICONS FOR UI ACTIONS AND RESULTS
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// MAIN AI UNDERWRITER COMPONENT
function AiTab() {

  // STORES USER INPUT VALUES FROM FORM
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [credit, setCredit] = useState('');
  const [loan, setLoan] = useState('');

  // HANDLES LOADING STATE, RESULT OUTPUT AND ERRORS
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // HANDLES AI ANALYSIS FLOW WITH FAILOVER LOGIC
  const handleAnalysis = async (e) => {
    e.preventDefault();

    // RESET UI BEFORE NEW REQUEST
    setLoading(true);
    setError('');
    setResult(null);

    let pythonResponse = null;

    try {
      // ATTEMPT REQUEST TO REMOTE PYTHON AI SERVER
      pythonResponse = await axios.post('http://206.81.22.189:5000/api/predict', {
        annualIncome: parseFloat(income),
        creditScore: parseInt(credit),
        loanAmount: parseFloat(loan)
      });

    } catch (dropletError) {

      // FALLBACK TO LOCAL PYTHON SERVER IF REMOTE FAILS
      console.warn("Droplet AI server unreachable. Trying Localhost...");
      try {
        pythonResponse = await axios.post('http://localhost:5000/api/predict', {
          annualIncome: parseFloat(income),
          creditScore: parseInt(credit),
          loanAmount: parseFloat(loan)
        });
      } catch (localError) {
        setError("Network Error: Both Droplet and Localhost Python servers are down.");
        setLoading(false);
        return;
      }

    } finally {
      // LOG COMPLETION OF NETWORK REQUEST
      console.log("AI Prediction network request finished.");
    }

    // SAVE AI RESULT TO JAVA BACKEND DATABASE
    try {
      const aiVerdict = pythonResponse.data.aiClassification;
      
      // BUNDLE DATA TO KEEP CODE CLEAN
      const applicantData = {
        name,
        annualIncome: parseFloat(income),
        creditScore: parseInt(credit),
        loanAmount: parseFloat(loan),
        status: 'AI Evaluated',
        aiClassification: aiVerdict
      };

      try {
        // ATTEMPT REQUEST TO REMOTE JAVA SERVER
        await axios.post('http://206.81.22.189:8080/api/applicants', applicantData);
        
      } catch (dropletDbError) {
        // FALLBACK TO LOCAL JAVA SERVER IF REMOTE FAILS
        console.warn("Droplet Java server unreachable. Trying Localhost...");
        await axios.post('http://localhost:8080/api/applicants', applicantData);
      }

      // UPDATE UI WITH RESULT AND CLEAR FORM
      setResult(aiVerdict);
      setName('');
      setIncome('');
      setCredit('');
      setLoan('');

    } catch (dbError) {
      // HANDLE DATABASE SAVE FAILURE
      setError("AI succeeded, but failed to save to database.");
    } finally {
      // STOP LOADING STATE AFTER PROCESS COMPLETION
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>

      {/* DISPLAYS PAGE HEADER */}
      <Typography variant="h4" color="primary.dark" fontWeight="bold" gutterBottom>
        AI Underwriter
      </Typography>

      {/* DISPLAYS PAGE DESCRIPTION */}
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Enter the applicant's financial details below to run a live Machine Learning prediction.
      </Typography>

      {/* MAIN LAYOUT CONTAINER FOR FORM AND RESULT */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          alignItems: 'stretch'
        }}
      >

        {/* LEFT SIDE CONTAINS INPUT FORM */}
        <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: 4 }}>

            {/* FORM TITLE */}
            <Typography variant="h6" fontWeight="bold" color="primary.dark" gutterBottom>
              Applicant Details
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleAnalysis}>

              {/* INPUT FIELD FOR USER NAME */}
              <TextField
                fullWidth
                label="Full Name"
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              {/* INPUT FIELD FOR INCOME */}
              <TextField
                fullWidth
                label="Annual Income ($)"
                type="number"
                sx={{ mb: 2 }}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
              />

              {/* INPUT FIELD FOR CREDIT SCORE */}
              <TextField
                fullWidth
                label="Credit Score (300-850)"
                type="number"
                sx={{ mb: 2 }}
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                required
              />

              {/* INPUT FIELD FOR LOAN AMOUNT */}
              <TextField
                fullWidth
                label="Loan Amount Request ($)"
                type="number"
                sx={{ mb: 4 }}
                value={loan}
                onChange={(e) => setLoan(e.target.value)}
                required
              />

              {/* BUTTON TO TRIGGER AI ANALYSIS */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={<SendIcon />}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? 'Running Analysis...' : 'Run AI Analysis'}
              </Button>

            </form>

          </CardContent>
        </Card>

        {/* RIGHT SIDE DISPLAYS AI RESULT */}
        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              result === 'Approved'
                ? '#f1f8e9'
                : result === 'Denied'
                ? '#ffebee'
                : '#fafafa'
          }}
        >

          <CardContent sx={{ textAlign: 'center', width: '100%', p: 4 }}>

            {/* TITLE FOR RESULT SECTION */}
            <Typography variant="h5" color="text.secondary" fontWeight="bold" gutterBottom>
              AI Verdict
            </Typography>

            {/* SHOWS INITIAL STATE BEFORE INPUT */}
            {!loading && !result && !error && (
              <Typography variant="body1" color="text.disabled" sx={{ mt: 2 }}>
                Waiting for data input...
              </Typography>
            )}

            {/* SHOWS LOADING STATE DURING PROCESS */}
            {loading && (
              <Box sx={{ mt: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ mt: 3, color: 'primary.main', fontWeight: 'bold' }}>
                  Processing...
                </Typography>
              </Box>
            )}

            {/* DISPLAYS ERROR MESSAGE */}
            {error && (
              <Typography color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                {error}
              </Typography>
            )}

            {/* DISPLAYS FINAL AI RESULT */}
            {result && (
              <Box sx={{ mt: 2 }}>

                {/* SHOWS ICON BASED ON RESULT */}
                {result === 'Approved' ? (
                  <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 100 }} />
                ) : (
                  <HighlightOffIcon color="error" sx={{ fontSize: 100 }} />
                )}

                {/* SHOWS RESULT TEXT */}
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    mt: 2,
                    color: result === 'Approved' ? 'success.dark' : 'error.dark'
                  }}
                >
                  {result.toUpperCase()}
                </Typography>

              </Box>
            )}

          </CardContent>
        </Card>

      </Box>
    </Box>
  );
}

export default AiTab;