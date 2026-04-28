import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Card, CardContent, Button, CircularProgress 
} from '@mui/material';
import EuroIcon from '@mui/icons-material/Euro';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import RefreshIcon from '@mui/icons-material/Refresh';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

function DashboardTab() {

  // STORES LIVE EXCHANGE RATE DATA FROM API
  const [rates, setRates] = useState(null);

  // STORES FORMATTED DATA USED FOR THE LINE CHART
  const [chartData, setChartData] = useState([]);

  // CONTROLS LOADING STATE WHILE FETCHING API DATA
  const [loading, setLoading] = useState(true);

  // STORES ERROR MESSAGE IF API CALL FAILS
  const [error, setError] = useState('');

  // RUNS ONCE WHEN COMPONENT LOADS
  useEffect(() => {
    fetchMarketData();
  }, []);

  // FETCHES BOTH EXCHANGE RATES AND MARKET TREND DATA
  const fetchMarketData = async () => {
    try {
      setLoading(true);

      // FETCH CURRENT USD EXCHANGE RATES
      const ratesResponse = await axios.get('https://open.er-api.com/v6/latest/USD');
      setRates(ratesResponse.data.rates);

      // FETCH BITCOIN PRICE DATA
      const chartResponse = await axios.get(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
        {
          params: {
            vs_currency: 'usd',
            days: 30,
            interval: 'daily'
          }
        }
      );

      // TRANSFORM API INTO CLEAN CHART FORMAT
      const formattedData = chartResponse.data.prices.map(item => {
        const date = new Date(item[0]);
        return {
          day: `${date.getMonth() + 1}/${date.getDate()}`,
          price: Math.round(item[1])
        };
      });

      setChartData(formattedData);
      setLoading(false);

    } catch (err) {
      setError('Failed to fetch live API data.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>

      {/* PAGE TITLE */}
      <Typography variant="h4" color="primary.dark" fontWeight="bold" gutterBottom>
        Live Dashboard
      </Typography>

      {/* SUBTITLE */}
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Real-time exchange rates of $1.00 (USD) & Bitcoin market Chart
      </Typography>

      {/* LOADING INDICATOR */}
      {loading && (
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
      )}

      {/* ERROR MESSAGE DISPLAY */}
      {error && (
        <Typography color="error">{error}</Typography>
      )}

      {/* CURRENCY RATE CARDS */}
      {!loading && rates && (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 5 }}>

          {/* EURO CARD */}
          <Card sx={{ flex: 1, minWidth: 200, borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ backgroundColor: 'primary.main', color: 'white', borderRadius: '50%', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                <EuroIcon />
              </Box>
              <Typography variant="h6" color="text.secondary">Euro</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.dark">
                €{rates.EUR.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>

          {/* POUND CARD */}
          <Card sx={{ flex: 1, minWidth: 200, borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ backgroundColor: 'primary.main', color: 'white', borderRadius: '50%', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                <CurrencyPoundIcon />
              </Box>
              <Typography variant="h6" color="text.secondary">Pound</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.dark">
                £{rates.GBP.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>

          {/* YEN CARD */}
          <Card sx={{ flex: 1, minWidth: 200, borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ backgroundColor: 'primary.main', color: 'white', borderRadius: '50%', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                <CurrencyYenIcon />
              </Box>
              <Typography variant="h6" color="text.secondary">Yen</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.dark">
                ¥{rates.JPY.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>

        </Box>
      )}

      {/* LINE CHART SECTION*/}
      {!loading && chartData.length > 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: 2, p: 3, mb: 3 }}>

          <Typography variant="h6" color="primary.dark" fontWeight="bold" sx={{ mb: 3 }}>
            Bitcoin market Chart (Last 30 Days)
          </Typography>

          {/* RESPONSIVE CHART CONTAINER */}
          <Box sx={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={chartData}>

                {/* GRID BACKGROUND */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* X-AXIS*/}
                <XAxis dataKey="day" tick={{ fill: '#666' }} />

                {/* Y-AXIS*/}
                <YAxis 
                  domain={['auto', 'auto']} 
                  tick={{ fill: '#666' }} 
                  tickFormatter={(value) => `$${value}`} 
                />

                {/* TOOLTIP ON HOVER */}
                <Tooltip formatter={(value) => [`$${value}`, 'Price']} />

                {/* LINE GRAPH */}
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#1976d2" 
                  strokeWidth={3} 
                  dot={false} 
                  activeDot={{ r: 8 }} 
                />

              </LineChart>

            </ResponsiveContainer>
          </Box>

        </Card>
      )}

    </Box>
  );
}

export default DashboardTab;