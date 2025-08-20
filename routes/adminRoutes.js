const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleSuspiciousUser,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// 🔹 All routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

// Get all job seekers
router.get("/users", getAllUsers);

// Get single job seeker details
router.get("/users/:id", getUserById);

// Delete a suspicious or blocked user
router.delete("/users/:id", deleteUser);

// Flag / unflag a user as suspicious
router.patch("/users/:id/toggle-suspicious", toggleSuspiciousUser);


module.exports = router;
