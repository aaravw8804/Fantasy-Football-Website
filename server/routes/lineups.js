// routes/lineups.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.get('/', async (req, res) => {
  try {
    const { fixture } = req.query;
    if (!fixture) {
      return res.status(400).json({ error: 'fixture parameter is required' });
    }
    // Call the API-Football lineups endpoint
    const response = await axios.get('https://v3.football.api-sports.io/lineups', {
      params: { fixture: fixture },
      headers: {
        'x-apisports-key': process.env.API_KEY, // Set your API key in .env file
        'x-apisports-host': 'v3.football.api-sports.io',
      },
    });
    // Return the response data to the client
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching lineups:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
