const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const User = require('./models/User');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid' });
  }
};

app.use('/api/auth', authRoutes);

const API_BASE_URL = process.env.API_BASE_URL || 'https://v3.football.api-sports.io';

app.get('/api/fixtures', async (req, res) => {
  try {
    const { league = 39, season = 2023 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/fixtures`, {
      params: { league, season },
      headers: {
        'x-apisports-key': process.env.APISPORTS_KEY,
        'x-apisports-host': 'v3.football.api-sports.io'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching fixtures:', err.message);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

app.get('/api/fixture/:id', async (req, res) => {
  try {
    const fixtureId = req.params.id;
    const response = await axios.get(`${API_BASE_URL}/fixtures`, {
      params: { id: fixtureId },
      headers: {
        'x-apisports-key': process.env.APISPORTS_KEY,
        'x-apisports-host': 'v3.football.api-sports.io'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(`Error fetching fixture ${fixtureId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch fixture details' });
  }
});

app.get('/api/lineups', async (req, res) => {
  try {
    const { fixture } = req.query;
    if (!fixture) return res.status(400).json({ error: 'fixture parameter is required' });

    const response = await axios.get(`${API_BASE_URL}/fixtures/players`, {
      params: { fixture },
      headers: {
        'x-apisports-key': process.env.APISPORTS_KEY,
        'x-apisports-host': 'v3.football.api-sports.io'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(`Error fetching lineup for fixture ${req.query.fixture}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch lineup data' });
  }
});

app.post('/api/play-match', authMiddleware, async (req, res) => {
  const { fixtureId, teamData } = req.body;

  try {
    const lineupResponse = await axios.get(`${API_BASE_URL}/fixtures/players`, {
      params: { fixture: fixtureId },
      headers: {
        'x-apisports-key': process.env.APISPORTS_KEY,
        'x-apisports-host': 'v3.football.api-sports.io'
      }
    });

    const allPlayers = lineupResponse.data.response.flatMap(team => team.players);
    let matchScore = 0;

    teamData.forEach(selectedPlayer => {
      const realPlayerObj = allPlayers.find(p => p.player.id === selectedPlayer.playerId);
      const stats = realPlayerObj?.statistics?.[0];

      console.log('Checking player:', selectedPlayer.playerName, stats);

      if (stats) {
        const minutesPlayed = stats.games?.minutes || 0;
        const goalsScored = stats.goals?.total || 0;
        const goalsConceded = stats.goals?.conceded ?? null;
        const assists = stats.goals?.assists || 0;
        const yellowCards = stats.cards?.yellow || 0;
        const redCards = stats.cards?.red || 0;
        const passes = stats.passes?.total || 0;
        const duelsWon = stats.duels?.won || 0;

        if (minutesPlayed > 0) matchScore += 2;
        matchScore += goalsScored * 5;
        matchScore += assists * 3;
        matchScore += duelsWon * 0.5;
        matchScore += passes >= 30 ? 1 : 0;

        if (selectedPlayer.spot === 'GK' && goalsConceded === 0) matchScore += 5;
        matchScore -= yellowCards * 1;
        matchScore -= redCards * 3;

        console.log(`✅ ${selectedPlayer.playerName}: Score so far = ${matchScore}`);
      } else {
        console.warn(`⚠️ No stats found for player: ${selectedPlayer.playerName}`);
      }
    });

    const fixtureDetails = await axios.get(`${API_BASE_URL}/fixtures`, {
      params: { id: fixtureId },
      headers: {
        'x-apisports-key': process.env.APISPORTS_KEY,
        'x-apisports-host': 'v3.football.api-sports.io'
      }
    });

    const fixture = fixtureDetails.data.response[0];
    const matchInfo = `${fixture.teams.home.name} vs ${fixture.teams.away.name}`;

    const user = await User.findById(req.user.id);
    if (!user) throw new Error("User not found!");

    user.matchesPlayed.push({ teams: matchInfo, date: new Date(), score: matchScore });
    user.totalScore += matchScore;
    await user.save();

    res.json({ matchScore });
  } catch (error) {
    console.error('❌ Error playing match:', error.message, error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ totalScore: -1 })
      .select('username totalScore');
    res.json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ msg: 'Failed to load profile' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
