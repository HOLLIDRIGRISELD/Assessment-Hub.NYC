import React, { useState, useEffect } from 'react';
import axios from 'axios';

// HANDLES FULL CRUD OPERATIONS WITH CREATE, UPDATE, DELETE AND EDIT MODE
function ApplicantsTab() {

  // STORES LIST OF APPLICANTS FROM BACKEND
  const [applicants, setApplicants] = useState([]);

  // STORES FORM INPUT VALUES
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [credit, setCredit] = useState('');
  const [loan, setLoan] = useState('');

  // PRESERVES STATUS AND AI CLASSIFICATION DURING EDITS
  const [status, setStatus] = useState('Pending');
  const [aiClass, setAiClass] = useState('Not Analyzed');

  // TRACKS CURRENTLY EDITED APPLICANT ID
  const [editingId, setEditingId] = useState(null);

  // FETCHES APPLICANTS WHEN COMPONENT LOADS
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

  // HANDLES CREATE AND UPDATE OPERATIONS BASED ON EDIT MODE
  const handleSubmit = async (e) => {
    e.preventDefault();

    // BUILDS REQUEST PAYLOAD
    const payload = {
      name: name,
      annualIncome: parseFloat(income),
      creditScore: parseInt(credit),
      loanAmount: parseFloat(loan),
      status: status,
      aiClassification: aiClass
    };

    try {
      if (editingId) {
        // UPDATES EXISTING APPLICANT RECORD
        await axios.put(`http://localhost:8080/api/applicants/${editingId}`, payload);
        setEditingId(null);
      } else {
        // CREATES NEW APPLICANT RECORD
        await axios.post('http://localhost:8080/api/applicants', payload);
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

  // RESETS FORM FIELDS AND EDIT MODE
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
    <div>
      <h2> Applicant Database (CRUD)</h2>

      {/* FORM FOR CREATING OR UPDATING APPLICANTS */}
      <div style={{ border: '1px solid black', padding: '10px', marginBottom: '20px', backgroundColor: editingId ? '#fff3cd' : 'transparent' }}>
        <h3>{editingId ? `Editing Applicant ID: ${editingId}` : 'Add New Applicant'}</h3>

        <form onSubmit={handleSubmit}>

          {/* INPUT FIELDS FOR APPLICANT DATA */}
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ marginRight: '5px' }} />
          <input type="number" placeholder="Annual Income" value={income} onChange={e => setIncome(e.target.value)} required style={{ marginRight: '5px' }} />
          <input type="number" placeholder="Credit Score" value={credit} onChange={e => setCredit(e.target.value)} required style={{ marginRight: '5px' }} />
          <input type="number" placeholder="Loan Amount" value={loan} onChange={e => setLoan(e.target.value)} required style={{ marginRight: '5px' }} />

          {/* SUBMIT BUTTON CHANGES BASED ON MODE */}
          <button type="submit" style={{ fontWeight: 'bold', marginRight: '5px' }}>
            {editingId ? 'Update Applicant' : 'Save to Database'}
          </button>

          {/* CANCEL BUTTON ONLY VISIBLE IN EDIT MODE */}
          {editingId && (
            <button type="button" onClick={resetForm} style={{ color: 'red' }}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* TABLE DISPLAYING ALL APPLICANTS WITH ACTIONS */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Income</th>
            <th>Credit Score</th>
            <th>Loan Request</th>
            <th>AI Status</th>
            <th>Actions</th>
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

              {/* DISPLAYS AI RESULT WITH COLOR CODING */}
              <td style={{ color: app.aiClassification === 'Approved' ? 'green' : (app.aiClassification === 'Denied' ? 'red' : 'black') }}>
                {app.aiClassification}
              </td>

              {/* ACTION BUTTONS FOR EDIT AND DELETE */}
              <td>
                <button onClick={() => handleEditClick(app)} style={{ color: 'blue', marginRight: '10px' }}>
                  Edit
                </button>
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