const mongoose = require("mongoose");

const AccessLogSchema = new mongoose.Schema({
  email: { type: String },
  ip: { type: String },
  device: { type: String },
  success: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AccessLog", AccessLogSchema);
