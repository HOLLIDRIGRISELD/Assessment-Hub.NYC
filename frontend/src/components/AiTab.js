import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, TextField, Button, CircularProgress, Divider } from '@mui/material';

// ICONS
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// AI UNDERWRITER COMPONENT
function AiTab() {

  // USER INPUT DATA
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [credit, setCredit] = useState('');
  const [loan, setLoan] = useState('');

  // LOADING RESULTS AMD ERROR HANDLING
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // MAIN AI ANALYSIS FUNCTION
  const handleAnalysis = async (e) => {
    e.preventDefault();

    // RESET UI STATE BEFORE NEW REQUEST
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // CALL PYTHON AI MICROSERVICE (MODEL PREDICTION)
      const pythonResponse = await axios.post('http://localhost:5000/api/predict', {
        annualIncome: parseFloat(income),
        creditScore: parseInt(credit),
        loanAmount: parseFloat(loan)
      });

      const aiVerdict = pythonResponse.data.aiClassification;

      // SAVE RESULT TO JAVA BACKEND DATABASE
      await axios.post('http://localhost:8080/api/applicants', {
        name,
        annualIncome: parseFloat(income),
        creditScore: parseInt(credit),
        loanAmount: parseFloat(loan),
        status: 'AI Evaluated',
        aiClassification: aiVerdict
      });

      // UPDATE UI WITH AI RESULT
      setResult(aiVerdict);
      setLoading(false);

      // CLEAR FORM AFTER SUCCESSFUL SUBMISSION
      setName('');
      setIncome('');
      setCredit('');
      setLoan('');

    } catch (err) {
      // HANDLE NETWORK OR SERVER FAILURES
      setError("Network Error: Ensure Python and Java are running.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>

      {/* PAGE HEADER */}
      <Typography variant="h4" color="primary.dark" fontWeight="bold" gutterBottom>
        AI Underwriter
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Enter the applicant's financial details below to run a live Machine Learning prediction.
      </Typography>

      {/* MAIN LAYOUT CONTAINER */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          alignItems: 'stretch'
        }}
      >

        {/* LEFT PANEL: INPUT FORM */}
        <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: 4 }}>

            <Typography variant="h6" fontWeight="bold" color="primary.dark" gutterBottom>
              Applicant Details
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleAnalysis}>

              {/* NAME INPUT */}
              <TextField
                fullWidth
                label="Full Name"
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              {/* INCOME INPUT */}
              <TextField
                fullWidth
                label="Annual Income ($)"
                type="number"
                sx={{ mb: 2 }}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
              />

              {/* CREDIT SCORE INPUT */}
              <TextField
                fullWidth
                label="Credit Score (300-850)"
                type="number"
                sx={{ mb: 2 }}
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                required
              />

              {/* LOAN INPUT */}
              <TextField
                fullWidth
                label="Loan Amount Request ($)"
                type="number"
                sx={{ mb: 4 }}
                value={loan}
                onChange={(e) => setLoan(e.target.value)}
                required
              />

              {/* SUBMIT BUTTON */}
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

        {/* RIGHT PANEL: RESULT DISPLAY */}
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

            {/* RESULT TITLE */}
            <Typography variant="h5" color="text.secondary" fontWeight="bold" gutterBottom>
              AI Verdict
            </Typography>

            {/* INITIAL STATE */}
            {!loading && !result && !error && (
              <Typography variant="body1" color="text.disabled" sx={{ mt: 2 }}>
                Waiting for data input...
              </Typography>
            )}

            {/* LOADING STATE */}
            {loading && (
              <Box sx={{ mt: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ mt: 3, color: 'primary.main', fontWeight: 'bold' }}>
                  Processing...
                </Typography>
              </Box>
            )}

            {/* ERROR STATE */}
            {error && (
              <Typography color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                {error}
              </Typography>
            )}

            {/* RESULT STATE */}
            {result && (
              <Box sx={{ mt: 2 }}>

                {/* ICON BASED ON RESULT */}
                {result === 'Approved' ? (
                  <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 100 }} />
                ) : (
                  <HighlightOffIcon color="error" sx={{ fontSize: 100 }} />
                )}

                {/* RESULT TEXT */}
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