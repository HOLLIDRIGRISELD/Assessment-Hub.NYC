import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DashboardTab() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the live data as soon as the tab loads
  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      // HOT SWAP: Using a more reliable open API endpoint
      const response = await axios.get('https://open.er-api.com/v6/latest/USD');
      
      setRates(response.data.rates);
      setLoading(false);
    } catch (err) {
      console.error("API Error details:", err); // This prints the exact error in your browser console!
      setError('Failed to fetch live API data. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2> Live Dashboard (Third-Party API)</h2>
      <p>Current exchange rates for <strong>$1.00 USD</strong>:</p>

      {/* Show a loading message while waiting for the internet */}
      {loading && <p>Fetching live data from exchange servers...</p>}
      
      {/* Show an error if the API is down */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {/* Show the data once it arrives! */}
      {rates && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ border: '1px solid black', padding: '15px', width: '150px', textAlign: 'center' }}>
            <h3>Euro (EUR)</h3>
            <p style={{ fontSize: '24px', margin: '0' }}>€{rates.EUR.toFixed(2)}</p>
          </div>
          
          <div style={{ border: '1px solid black', padding: '15px', width: '150px', textAlign: 'center' }}>
            <h3>Pound (GBP)</h3>
            <p style={{ fontSize: '24px', margin: '0' }}>£{rates.GBP.toFixed(2)}</p>
          </div>
          
          <div style={{ border: '1px solid black', padding: '15px', width: '150px', textAlign: 'center' }}>
            <h3>Yen (JPY)</h3>
            <p style={{ fontSize: '24px', margin: '0' }}>¥{rates.JPY.toFixed(2)}</p>
          </div>
        </div>
      )}

      <button onClick={fetchMarketData} style={{ marginTop: '20px' }}>
        Refresh Live Rates
      </button>
    </div>
  );
}

export default DashboardTab;