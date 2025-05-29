// models/Player.js
const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  team: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Player', PlayerSchema);
