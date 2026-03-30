const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");
const Settings = require("../models/Settings");

// Get current settings
router.get("/", verifyToken, checkAdmin, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings (like dollar rate)
router.put("/", verifyToken, checkAdmin, async (req, res) => {
  try {
    const { dollarRate } = req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      { dollarRate, updatedBy: req.user.id, updatedAt: Date.now() },
      { new: true, upsert: true },
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
