const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  staticIP: { type: String, default: null },
  isSuperAdmin: { type: Boolean, default: false },
  failedAttempts: { type: Number, default: 0 },
  otp: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
});

module.exports = mongoose.model("Admin", AdminSchema);
