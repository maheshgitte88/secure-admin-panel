const axios = require("axios");
const allowedLAN = /^192\.168\.|^10\./;
const Admin = require("../models/Admin");
const AccessLog = require("../models/AccessLog");
const { sendEmail } = require("../config/email");
const { sendSMS } = require("../config/sms");


// Service For VPN Checks if the given IP address is a VPN. need to add logic As per required
const checkVPN = async (ip) => {
  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`
    );
    return response.data.vpn || false;
  } catch (error) {
    console.error("VPN Check Failed:", error.message);
    return false;
  }
};

const restrictLANAccess = async (req, res, next) => {
  let userIP = req.ip || req.connection.remoteAddress;

  // Handle localhost for testing
  //   if (userIP === "::1" || userIP === "127.0.0.1") {
  //     return next();
  //   }

  if (req.headers["x-forwarded-for"]) {
    userIP = req.headers["x-forwarded-for"].split(",")[0].trim();
  }

  // Allow direct access for LAN users
  if (allowedLAN.test(userIP)) {
    console.log("Access allowed: LAN IP detected.");
    return next();
  }

  try {
    // Check if user has a registered Static IP
    const admin = await Admin.findOne({ staticIP: userIP });
    if (admin) {
      console.log("Static IP found:", admin.email);
      return next();
    }

    // Require OTP for remote access
    const { otp } = req.headers;
    if (otp) {
      const otpValid = await Admin.findOne({
        otp,
        otpExpiresAt: { $gt: Date.now() },
      });

      if (otpValid) {
        console.log("OTP Verified for:", otpValid.email);
        await AccessLog.create({
          ip: userIP,
          success: true,
          device: req.headers["user-agent"],
        });

        return next();
      }
    }

    // If OTP is missing or invalid, check VPN
    const isVPN = await checkVPN(userIP);
    if (isVPN) {
      console.warn("Access allowed: User is using a VPN.");
      await AccessLog.create({
        ip: userIP,
        success: true,
        device: req.headers["user-agent"],
      });

      return next();
    }

    throw new Error("Access denied: OTP required or VPN must be used.");
  } catch (error) {
    console.error("Access Denied:", error.message);

    // Log unauthorized access attempt
    await AccessLog.create({
      ip: userIP,
      success: false,
      device: req.headers["user-agent"],
    });

    // Send alerts to super admin
    await sendEmail(
      process.env.SUPER_ADMIN_EMAIL,
      "Unauthorized Access Attempt",
      `Blocked IP: ${userIP}`
    );
    await sendSMS(
      process.env.SUPER_ADMIN_PHONE,
      `Unauthorized Admin Panel Access Attempt from IP: ${userIP}`
    );

    return res.status(403).json({ message: error.message });
  }
};

module.exports = restrictLANAccess;
