const express = require("express");
const { updateProfile, getProfile } = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Profile
 *   description: User profile management APIs
 */

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user profile (with profile image, cover image, resume)
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               bio:
 *                 type: string
 *                 example: Full Stack Developer with 3+ years experience
 *               location:
 *                 type: string
 *                 example: Chennai
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React", "Node.js"]
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/update",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 64f1c8b9a2c4d8e123456789
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 bio:
 *                   type: string
 *                   example: Full Stack Developer
 *                 location:
 *                   type: string
 *                   example: Chennai
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["React", "Node.js"]
 *                 profileImage:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/profile.jpg
 *                 coverImage:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/cover.jpg
 *                 resume:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/raw/upload/resume.pdf
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", protect, getProfile);

module.exports = router;
