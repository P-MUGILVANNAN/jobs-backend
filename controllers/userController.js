const User = require("../models/User");

// 🔹 Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body };

    // Utility: safely parse arrays or objects
    const safeParse = (val, fallback) => {
      if (val === undefined || val === null) return fallback;
      if (Array.isArray(val) || typeof val === "object") return val;
      try {
        return JSON.parse(val);
      } catch (e) {
        if (typeof val === "string") {
          return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return fallback;
      }
    };

    // 🔹 Parse complex fields
    if (updates.skills !== undefined)
      updates.skills = safeParse(updates.skills, []);
    if (updates.education !== undefined)
      updates.education = safeParse(updates.education, []);
    if (updates.projects !== undefined)
      updates.projects = safeParse(updates.projects, []);

    // 🔹 Handle file uploads (profile, cover, resume)
    if (req.files) {
      if (req.files.profileImage && req.files.profileImage[0])
        updates.profileImage = req.files.profileImage[0].path;
      if (req.files.coverImage && req.files.coverImage[0])
        updates.coverImage = req.files.coverImage[0].path;
      if (req.files.resume && req.files.resume[0])
        updates.resume = req.files.resume[0].path;
    }

    // 🔹 Handle category (optional)
    if (updates.category) {
      const allowedCategories = [
        "jobseeker",
        "fresher",
        "housewife",
        "student",
        "experienced",
        "freelancer",
        "career break",
        "others",
      ];
      if (!allowedCategories.includes(updates.category)) {
        return res
          .status(400)
          .json({ message: "Invalid category value provided" });
      }
    }

    // 🔹 Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfile, getProfile };
