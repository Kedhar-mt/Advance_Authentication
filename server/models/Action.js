const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating random IDs

const ActionSchema = new mongoose.Schema({
  actionId: { type: String, default: uuidv4, unique: true }, // Generate random ID
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Action', ActionSchema);
