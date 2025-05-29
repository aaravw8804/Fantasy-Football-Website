// routes/teams.js
const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const authMiddleware = require('../middleware/auth');

// Get all teams (public demo endpoint)
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('owner', 'username')
      .populate('players');
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new team (protected route)
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const newTeam = new Team({ name, owner: req.user.id });
    const team = await newTeam.save();
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
