const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getJobs);        // Get all jobs
router.get("/:id", getJobById);  // Get single job

// Admin only
router.post("/", protect, adminOnly, upload.single("companyImage"), createJob);
router.put("/:id", protect, adminOnly, upload.single("companyImage"), updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);

module.exports = router;
