const User = require("../models/User");
const Job = require("../models/Job");

// 🔹 Get all users with pagination, filter, search, and category filter
const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, role, from, to, search, category } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Build filter object
    let filter = { role: "user" };

    if (role) filter.role = role;

    // 🔹 Filter by category (optional)
    if (category) {
      filter.category = category;
    }

    // 🔹 Date filter (from - to)
    if (from && to) {
      filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    }

    // 🔹 Search by name, email, or skills
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { skills: regex }];
    }

    // Count total docs for pagination
    const totalUsers = await User.countDocuments(filter);

    // Query with pagination
    const users = await User.find(filter)
      .select("-password") // exclude password
      .populate("appliedJobs", "title description location jobType skills createdBy")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Get single user with full details
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password")
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

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleSuspiciousUser,
};
