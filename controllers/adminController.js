const User = require("../models/User");
const Job = require("../models/Job");

// 🔹 Get all users with full details
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password") // exclude password
      .populate("appliedJobs", "title description location jobType skills createdBy");

    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Get single user with full details
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password") // exclude password
      .populate("appliedJobs", "title description location jobType skills createdBy");

    if (!user || user.role !== "user") {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || user.role !== "user") {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Flag/unflag user as suspicious
const toggleSuspiciousUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || user.role !== "user") {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isSuspicious = !user.isSuspicious;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User isSuspicious set to ${user.isSuspicious}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Search users by name, email, skills
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, "i"); // case-insensitive

    const users = await User.find({
      role: "user",
      $or: [{ name: regex }, { email: regex }, { skills: regex }],
    })
      .select("-password")
      .populate("appliedJobs", "title description location jobType skills createdBy");

    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleSuspiciousUser,
  searchUsers,
};
