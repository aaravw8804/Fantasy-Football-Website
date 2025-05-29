// routes/players.js
const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new player (for demo/admin purposes)
router.post('/', async (req, res) => {
  const { name, position, team, price } = req.body;
  try {
    const newPlayer = new Player({ name, position, team, price });
    const player = await newPlayer.save();
    res.json(player);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
