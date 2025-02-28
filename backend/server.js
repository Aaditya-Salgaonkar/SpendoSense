require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// PayPal OAuth2 Credentials
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

app.use(cors());
app.use(express.json());

// Get access token
async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      }
    }
  );
  return response.data.access_token;
}

// Get all transactions
app.post('/api/transactions', async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const accessToken = await getAccessToken();

    const response = await axios.get(
      'https://api-m.sandbox.paypal.com/v1/reporting/transactions',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          start_date: new Date(start_date).toISOString(),
          end_date: new Date(end_date).toISOString(),
          fields: 'all',
          page_size: 100,
          page: 1
        }
      }
    );

    res.json(response.data.transaction_details);
  } catch (error) {
    console.error('Error fetching transactions:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});