// models/User.js
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  teams: String,
  date: Date,
  score: Number
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name:     { type: String, required: true },
  dob:      { type: Date, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt:{ type: Date, default: Date.now },
  matchesPlayed: [MatchSchema],
  totalScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);
