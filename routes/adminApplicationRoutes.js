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

/**
 * @swagger
 * tags:
 *   name: Admin Applications
 *   description: Admin-side application management APIs
 */

/**
 * @swagger
 * /admin/applications/apply:
 *   post:
 *     summary: Create a test application (Admin only)
 *     tags: [Admin Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *               userId:
 *                 type: string
 *               resume:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/applications/apply", protect, adminOnly, adminApplyJob);

/**
 * @swagger
 * /admin/jobs/{jobId}/applications:
 *   get:
 *     summary: Get all applications for a specific job (Admin only)
 *     tags: [Admin Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         schema:
 *           type: string
 *         required: true
 *         description: Job ID
 *     responses:
 *       200:
 *         description: List of applications for the job
 *       401:
 *         description: Unauthorized
 */
router.get("/jobs/:jobId/applications", protect, adminOnly, getApplicationsByJob);

/**
 * @swagger
 * /admin/applications:
 *   get:
 *     summary: Get all applications (Admin only)
 *     tags: [Admin Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: job
 *         schema:
 *           type: string
 *         description: Filter by jobId
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter by userId
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date applied
 *     responses:
 *       200:
 *         description: List of all applications
 *       401:
 *         description: Unauthorized
 */
router.get("/applications", protect, adminOnly, getAllApplications);

/**
 * @swagger
 * /admin/applications/{appId}:
 *   patch:
 *     summary: Update application status (accept/reject/shortlist) (Admin only)
 *     tags: [Admin Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appId
 *         schema:
 *           type: string
 *         required: true
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, shortlisted]
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch("/applications/:appId", protect, adminOnly, updateApplicationStatus);

/**
 * @swagger
 * /admin/applications/{appId}/notify:
 *   post:
 *     summary: Notify applicant via email/notification (Admin only)
 *     tags: [Admin Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appId
 *         schema:
 *           type: string
 *         required: true
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/applications/:appId/notify", protect, adminOnly, notifyApplicant);

module.exports = router;
