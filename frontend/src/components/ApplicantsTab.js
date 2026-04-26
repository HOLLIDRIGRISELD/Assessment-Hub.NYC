import React, { useState, useEffect } from 'react';
import axios from 'axios';

// HANDLES APPLICANT CRUD OPERATIONS AND UI DISPLAY
function ApplicantsTab() {

  // STORES LIST OF APPLICANTS FROM BACKEND
  const [applicants, setApplicants] = useState([]);
  
  // STORES INPUT VALUES FOR NEW APPLICANT FORM
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [credit, setCredit] = useState('');
  const [loan, setLoan] = useState('');

  // FETCHES APPLICANTS ON COMPONENT LOAD
  useEffect(() => {
    fetchApplicants();
  }, []);

  // RETRIEVES ALL APPLICANTS FROM BACKEND
  const fetchApplicants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/applicants');
      setApplicants(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // CREATES NEW APPLICANT RECORD
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/applicants', {
        name: name,
        annualIncome: parseFloat(income),
        creditScore: parseInt(credit),
        loanAmount: parseFloat(loan),
        status: 'Pending',
        aiClassification: 'Not Analyzed'
      });
      
      // RESETS FORM AND REFRESHES DATA
      setName(''); 
      setIncome(''); 
      setCredit(''); 
      setLoan('');
      fetchApplicants(); 

    } catch (error) {
      console.error("Error creating applicant: ", error);
    }
  };

  // DELETES APPLICANT BY ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/applicants/${id}`);
      fetchApplicants();
    } catch (error) {
      console.error("Error deleting applicant: ", error);
    }
  };

  return (
    <div>
      <h2> Applicant Database (CRUD)</h2>
      
      {/* FORM FOR ADDING NEW APPLICANT */}
      <div style={{ border: '1px solid black', padding: '10px', marginBottom: '20px' }}>
        <h3>Add New Applicant</h3>

        <form onSubmit={handleCreate}>

          {/* INPUT FIELDS FOR APPLICANT DATA */}
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="number" placeholder="Annual Income" value={income} onChange={e => setIncome(e.target.value)} required />
          <input type="number" placeholder="Credit Score" value={credit} onChange={e => setCredit(e.target.value)} required />
          <input type="number" placeholder="Loan Amount" value={loan} onChange={e => setLoan(e.target.value)} required />

          {/* SUBMIT BUTTON TO SAVE APPLICANT */}
          <button type="submit">Save to Database</button>
        </form>
      </div>

      {/* TABLE DISPLAYING APPLICANTS WITH DELETE OPTION */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Income</th>
            <th>Credit Score</th>
            <th>Loan Request</th>
            <th>AI Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {applicants.map((app) => (

            // RENDERS EACH APPLICANT ROW
            <tr key={app.id} style={{ textAlign: 'center' }}>
              <td>{app.id}</td>
              <td>{app.name}</td>
              <td>${app.annualIncome}</td>
              <td>{app.creditScore}</td>
              <td>${app.loanAmount}</td>
              <td>{app.aiClassification}</td>

              {/* DELETE BUTTON FOR EACH RECORD */}
              <td>
                <button onClick={() => handleDelete(app.id)} style={{ color: 'red' }}>
                  Delete
                </button>
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantsTab;