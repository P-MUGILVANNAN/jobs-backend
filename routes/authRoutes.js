const express = require("express");
const { sendOtp, verifyOtpAndRegister, loginUser, googleAuth } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *               role:
 *                 type: string
 *                 enum: [jobseeker, employer, admin]
 *                 example: jobseeker
 *     responses:
 *       201:
 *         description: User registered successfully with JWT token
 *       400:
 *         description: User already exists
 */
router.post("/send-otp", sendOtp); // Step 1: request OTP
router.post("/verify-otp", verifyOtpAndRegister); // Step 2: verify OTP & register

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate user with Google account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google OAuth token
 *                 example: ya29.a0AfH6SMB...
 *     responses:
 *       200:
 *         description: Google authentication successful
 *       401:
 *         description: Invalid Google token
 */
router.post("/google", googleAuth);

module.exports = router;
