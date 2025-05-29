// routes/fpl.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fetch season bootstrap data (includes teams, players, events, etc.)
router.get('/bootstrap', async (req, res) => {
  try {
    const response = await axios.get('https://fantasy.premierleague.com/api/bootstrap-static/');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching FPL bootstrap data:', error.message);
    res.status(500).json({ msg: 'Error fetching FPL data' });
  }
});

// Fetch live match data for a specific event
router.get('/live/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const response = await axios.get(`https://fantasy.premierleague.com/api/event/${eventId}/live/`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching FPL live data:', error.message);
    res.status(500).json({ msg: 'Error fetching FPL live data' });
  }
});

module.exports = router;
