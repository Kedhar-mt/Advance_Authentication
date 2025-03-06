const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    uid: { type: String, default: uuidv4, unique: true },
    email: { type: String, required: true, unique: true, index: true },
    displayName: { type: String },
    photoURL: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoogleUser', userSchema);
