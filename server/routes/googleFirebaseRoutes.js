const express = require('express');
const router = express.Router();
const User = require('../models/GoogleUser');

// Save Google user
router.post('/api/googleusers', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    // Find user or create a new one (upsert)
    const user = await User.findOneAndUpdate(
      { uid },
      { 
        uid,
        email, 
        displayName, 
        photoURL,
        lastLogin: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by UID
router.get('/api/googleusers/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
