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

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job posting and management APIs
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   company:
 *                     type: string
 *                   location:
 *                     type: string
 *                   experience:
 *                     type: string
 *                   jobType:
 *                     type: string
 *                   salary:
 *                     type: string
 */
router.get("/", getJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get single job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get("/:id", getJobById);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job (Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer
 *               company:
 *                 type: string
 *                 example: FIIT Solutions
 *               location:
 *                 type: string
 *                 example: Chennai
 *               experience:
 *                 type: string
 *                 example: 2-4 Years
 *               jobType:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Internship, Remote]
 *                 example: Full-Time
 *               salary:
 *                 type: string
 *                 example: 6-8 LPA
 *               description:
 *                 type: string
 *                 example: Looking for MERN Stack Developer
 *               companyImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Job created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, adminOnly, upload.single("companyImage"), createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update job details (Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               experience:
 *                 type: string
 *               jobType:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Internship, Remote]
 *               salary:
 *                 type: string
 *               description:
 *                 type: string
 *               companyImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, adminOnly, upload.single("companyImage"), updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job (Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, adminOnly, deleteJob);

module.exports = router;
