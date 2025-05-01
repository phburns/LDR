const express = require("express");
const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;

    // Replace this with a real secret or bcrypt.compare
    if (password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ success: false, message: 'Invalid password' });

  } catch (err) {
    console.error('Auth login crash:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Catch-all for method not allowed
router.all("*", (req, res) => {
  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
});

module.exports = router;