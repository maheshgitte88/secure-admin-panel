const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const Admin = require("../models/Admin");
const AccessLog = require("../models/AccessLog");
const { sendEmail } = require("../config/email");

const router = express.Router();

// ✅ Register Admin
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, staticIP, isSuperAdmin } = req.body;

    let existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      fullName,
      staticIP: staticIP || null,
      isSuperAdmin,
    });

    await newAdmin.save();

    await sendEmail(
      email,
      "Welcome to Secure Admin Panel",
      "Your account has been created successfully."
    );

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password, ip } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  if (admin.failedAttempts >= 5)
    return res.status(403).json({ message: "Account locked" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    admin.failedAttempts += 1;
    await admin.save();

    if (admin.failedAttempts >= 5) {
      await sendEmail(
        admin.email,
        "Account Locked",
        "Too many failed attempts."
      );
    }

    return res.status(401).json({ message: "Invalid credentials" });
  }

  admin.failedAttempts = 0;
  await admin.save();

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  await AccessLog.create({ email, ip, success: true });

  res.json({ token });
});

// Generate OTP for Remote Admins
router.post("/generate-otp", async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const otp = otpGenerator.generate(6, { digits: true });
  admin.otp = otp;
  admin.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await admin.save();

  await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);

  res.json({ message: "OTP sent" });
});

// Validate OTP
router.post("/validate-otp", async (req, res) => {
  const { email, otp } = req.body;
  const admin = await Admin.findOne({
    email,
    otp,
    otpExpiresAt: { $gt: new Date() },
  });

  if (!admin) return res.status(400).json({ message: "Invalid OTP" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

module.exports = router;
