// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  name: { type: String, required: true },     // store name
  email: { type: String, required: true },
  password: { type: String, required: true }, // store password temporarily
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("Otp", otpSchema);
