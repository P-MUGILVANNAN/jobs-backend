const express = require("express");
const router = express.Router();
const {
    adminApplyJob,
    getApplicationsByJob,
    getAllApplications,
    updateApplicationStatus,
    notifyApplicant,
} = require("../controllers/adminApplicationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 🔹 Route to create test application (admin only)
router.post("/applications/apply", protect, adminOnly, adminApplyJob);

// 🔹 Get all applications for a specific job
// GET /api/admin/jobs/:jobId/applications
router.get("/jobs/:jobId/applications", protect, adminOnly, getApplicationsByJob);

// 🔹 Get all applications
router.get("/applications", protect, adminOnly, getAllApplications);

// 🔹 Update application status (accept/reject/shortlist)
// PATCH /api/admin/applications/:appId
router.patch("/applications/:appId", protect, adminOnly, updateApplicationStatus);

// 🔹 Notify applicant via email/notification
// POST /api/admin/applications/:appId/notify
router.post("/applications/:appId/notify", protect, adminOnly, notifyApplicant);

module.exports = router;
