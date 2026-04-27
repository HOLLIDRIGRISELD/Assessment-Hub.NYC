import React, { useState } from 'react';
import axios from 'axios';

// HANDLES AI-BASED LOAN ANALYSIS AND DATABASE INTEGRATION
function AiTab() {

  // STORES USER INPUT FOR APPLICANT DETAILS
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [credit, setCredit] = useState('');
  const [loan, setLoan] = useState('');

  // MANAGES UI STATE FOR LOADING, RESULT, AND ERRORS
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // HANDLES FULL AI ANALYSIS WORKFLOW (PYTHON + JAVA)
  const handleAnalysis = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {

      // REQUESTS AI PREDICTION FROM PYTHON MICROSERVICE
      const pythonResponse = await axios.post('http://localhost:5000/api/predict', {
        annualIncome: parseFloat(income),
        creditScore: parseInt(credit),
        loanAmount: parseFloat(loan)
      });

      const aiVerdict = pythonResponse.data.aiClassification;

      // STORES RESULT IN JAVA BACKEND DATABASE
      await axios.post('http://localhost:8080/api/applicants', {
        name: name,
        annualIncome: parseFloat(income),
        creditScore: parseInt(credit),
        loanAmount: parseFloat(loan),
        status: 'AI Evaluated',
        aiClassification: aiVerdict
      });

      // UPDATES UI WITH FINAL RESULT
      setResult(aiVerdict);
      setLoading(false);

      // RESETS FORM INPUTS
      setName('');
      setIncome('');
      setCredit('');
      setLoan('');

    } catch (err) {
      console.error(err);

      // HANDLES NETWORK OR SERVER ERRORS
      setError("Network Error: Make sure both your Python server (5000) and Java server (8080) are running!");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2> AI Underwriter (Random Forest Model)</h2>
      <p>Enter the applicant's details below to run a live prediction.</p>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>

        {/* INPUT FORM FOR APPLICANT DATA */}
        <div style={{ border: '1px solid black', padding: '20px', width: '300px' }}>
          <h3>Applicant Details</h3>

          <form onSubmit={handleAnalysis}>

            {/* NAME INPUT FIELD */}
            <div style={{ marginBottom: '10px' }}>
              <label>Full Name: </label><br />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {/* INCOME INPUT FIELD */}
            <div style={{ marginBottom: '10px' }}>
              <label>Annual Income ($): </label><br />
              <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} required />
            </div>

            {/* CREDIT SCORE INPUT FIELD */}
            <div style={{ marginBottom: '10px' }}>
              <label>Credit Score (300-850): </label><br />
              <input type="number" value={credit} onChange={(e) => setCredit(e.target.value)} required />
            </div>

            {/* LOAN AMOUNT INPUT FIELD */}
            <div style={{ marginBottom: '10px' }}>
              <label>Loan Amount ($): </label><br />
              <input type="number" value={loan} onChange={(e) => setLoan(e.target.value)} required />
            </div>

            {/* SUBMIT BUTTON FOR AI ANALYSIS */}
            <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '10px', fontWeight: 'bold' }}>
              {loading ? 'Running AI Analysis...' : 'Run AI Analysis'}
            </button>
          </form>
        </div>

        {/* DISPLAYS AI RESULT AND STATUS */}
        <div style={{ border: '2px dashed gray', padding: '20px', width: '300px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3>AI Verdict</h3>

          {/* SHOWS LOADING STATE */}
          {loading && <p>Processing millions of data points...</p>}

          {/* SHOWS ERROR MESSAGE */}
          {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

          {/* SHOWS DEFAULT STATE BEFORE INPUT */}
          {!loading && !result && !error && <p style={{ color: 'gray' }}>Waiting for data input...</p>}

          {/* SHOWS FINAL AI RESULT */}
          {result && (
            <div>
              <h1 style={{ color: result === 'Approved' ? 'green' : 'red', fontSize: '36px', margin: '10px 0' }}>
                {result.toUpperCase()}
              </h1>
              <p>Decision saved to applicant database.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AiTab;