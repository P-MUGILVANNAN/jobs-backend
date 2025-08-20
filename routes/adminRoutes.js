const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleSuspiciousUser,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Admin Users
 *   description: Admin APIs for managing job seekers
 */

// 🔹 All routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all job seekers (Admin only)
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all job seekers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64f1c8b9a2c4d8e123456789
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *                   role:
 *                     type: string
 *                     example: jobseeker
 *                   isSuspicious:
 *                     type: boolean
 *                     example: false
 *       401:
 *         description: Unauthorized
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get single job seeker details (Admin only)
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Job seeker details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 isSuspicious:
 *                   type: boolean
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get("/users/:id", getUserById);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a suspicious or blocked user (Admin only)
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /admin/users/{id}/toggle-suspicious:
 *   patch:
 *     summary: Flag or unflag a user as suspicious (Admin only)
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User suspicious status updated
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/users/:id/toggle-suspicious", toggleSuspiciousUser);

module.exports = router;
