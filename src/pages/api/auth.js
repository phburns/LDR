const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// For testing purposes, let's first try with a simple password comparison
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    // Direct comparison for testing
    if (password === '4020') {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;