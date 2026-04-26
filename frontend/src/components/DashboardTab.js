import React, { useState, useEffect } from 'react';
import axios from 'axios';

// DISPLAYS LIVE MARKET DATA USING THIRD-PARTY API
function DashboardTab() {

  // STORES EXCHANGE RATE DATA
  const [rates, setRates] = useState(null);

  // TRACKS LOADING STATE DURING API CALL
  const [loading, setLoading] = useState(true);

  // STORES ERROR MESSAGE IF API CALL FAILS
  const [error, setError] = useState('');

  // FETCHES MARKET DATA WHEN COMPONENT LOADS
  useEffect(() => {
    fetchMarketData();
  }, []);

  // RETRIEVES LIVE EXCHANGE RATES FROM EXTERNAL API
  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError('');

      // SENDS REQUEST TO EXCHANGE RATE API
      const response = await axios.get('https://open.er-api.com/v6/latest/USD');

      setRates(response.data.rates);
      setLoading(false);

    } catch (err) {
      console.error("API Error details:", err);

      // SETS ERROR MESSAGE IF REQUEST FAILS
      setError('Failed to fetch live API data. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>📊 Live Dashboard (Third-Party API)</h2>
      <p>Current exchange rates for <strong>$1.00 USD</strong>:</p>

      {/* DISPLAYS LOADING MESSAGE DURING DATA FETCH */}
      {loading && <p>Fetching live data from exchange servers...</p>}
      
      {/* DISPLAYS ERROR MESSAGE IF API FAILS */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {/* DISPLAYS EXCHANGE RATE DATA WHEN AVAILABLE */}
      {rates && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>

          {/* EURO EXCHANGE RATE CARD */}
          <div style={{ border: '1px solid black', padding: '15px', width: '150px', textAlign: 'center' }}>
            <h3>Euro (EUR)</h3>
            <p style={{ fontSize: '24px', margin: '0' }}>€{rates.EUR.toFixed(2)}</p>
          </div>

          {/* POUND EXCHANGE RATE CARD */}
          <div style={{ border: '1px solid black', padding: '15px', width: '150px', textAlign: 'center' }}>
            <h3>Pound (GBP)</h3>
            <p style={{ fontSize: '24px', margin: '0' }}>£{rates.GBP.toFixed(2)}</p>
          </div>

          {/* YEN EXCHANGE RATE CARD */}
          <div style={{ border: '1px solid black', padding: '15px', width: '150px', textAlign: 'center' }}>
            <h3>Yen (JPY)</h3>
            <p style={{ fontSize: '24px', margin: '0' }}>¥{rates.JPY.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* BUTTON TO REFRESH LIVE DATA */}
      <button onClick={fetchMarketData} style={{ marginTop: '20px' }}>
        Refresh Live Rates
      </button>
    </div>
  );
}

export default DashboardTab;