const mongoose = require("mongoose");

const mockResultSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  questions: Array,
  answers: Array,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MockResult", mockResultSchema);
