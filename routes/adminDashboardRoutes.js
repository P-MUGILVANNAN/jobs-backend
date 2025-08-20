const express = require("express");
const { getDashboardStats } = require("../controllers/adminDashboardController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Dashboard
 *   description: Dashboard analytics and statistics for Admin
 */

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 120
 *                 totalJobs:
 *                   type: integer
 *                   example: 45
 *                 totalApplications:
 *                   type: integer
 *                   example: 300
 *                 recentApplications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobTitle:
 *                         type: string
 *                         example: Software Engineer
 *                       applicantName:
 *                         type: string
 *                         example: John Doe
 *                       appliedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-08-20T10:30:00Z
 *       401:
 *         description: Unauthorized
 */
router.get("/dashboard/stats", getDashboardStats);

module.exports = router;
