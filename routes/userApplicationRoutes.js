const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getUserApplications,
} = require("../controllers/userApplicationController");
const { protect, userOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: User Applications
 *   description: User-side job application APIs
 */

// 🔹 Apply for a job
router.post("/applications/:jobId", protect, userOnly, applyForJob);

// 🔹 Get all applied jobs + status
router.get("/applications", protect, userOnly, getUserApplications);

module.exports = router;
