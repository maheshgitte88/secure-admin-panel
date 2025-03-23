const express = require("express");
const authenticateAdmin = require("../middleware/authMiddleware");
const restrictLANAccess = require("../middleware/ipMiddleware");

const router = express.Router();

// Secure LAN-only Admin Panel Access
router.get("/", restrictLANAccess, authenticateAdmin, (req, res) => {
  res.json({ message: "Welcome to the Secure Admin Panel", admin: req.admin });
});

module.exports = router;
