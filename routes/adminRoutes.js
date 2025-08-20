const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleSuspiciousUser,
  searchUsers,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// 🔹 All routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

// Get all job seekers
router.get("/users", getAllUsers);

// Search users by name, email, or skills
router.get("/users/search", searchUsers);

// Get single job seeker details
router.get("/users/:id", getUserById);

// Delete a suspicious or blocked user
router.delete("/users/:id", deleteUser);

// Flag / unflag a user as suspicious
router.patch("/users/:id/toggle-suspicious", toggleSuspiciousUser);


module.exports = router;
