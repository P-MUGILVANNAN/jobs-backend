const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Job");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// 🔹 Admin adds a test application (simulate user applying)
const adminApplyJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent duplicate application
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: "Application already exists" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    res.status(201).json({ success: true, message: "Application created", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get ALL applications (admin only)
// 🔹 Get ALL applications with Pagination + Filters (Admin)
const getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      job,
      user,
      startDate,
      endDate,
      sort = "desc"
    } = req.query;

    const query = {};

    // Apply filters
    if (job) query.job = job;
    if (user) query.applicant = user;
    if (startDate && endDate) {
      query.appliedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch applications
    const applications = await Application.find(query)
      .populate("applicant", "name email phone location resume")
      .populate("job", "title location")
      .sort({ appliedAt: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalApplications = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      totalApplications,
      page: Number(page),
      totalPages: Math.ceil(totalApplications / limit),
      applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// 🔹 Get all applications for a specific job
const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Get applications and populate applicant info
    const applications = await Application.find({ job: jobId }).populate(
      "applicant",
      "name email profile resume"
    );

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body; // expected: "shortlisted", "accepted", "rejected"

    // Validate status
    const validStatuses = ["applied", "shortlisted", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, message: `Application ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const notifyApplicant = async (req, res) => {
  try {
    const { appId } = req.params;

    const application = await Application.findById(appId)
      .populate("applicant", "name email")
      .populate("job", "title"); // populate job title for email

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Create transporter (example using Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // HTML email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Job Application Update</h2>
        <p>Hi <strong>${application.applicant.name}</strong>,</p>
        <p>Your application for the job <strong>"${application.job.title}"</strong> has been updated.</p>
        <p>Status: <strong style="color: #FF5722;">${application.status.toUpperCase()}</strong></p>
        <p>Thank you for applying. Stay tuned for further updates.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Admin Team</strong></p>
      </div>
    `;

    // Mail options
    const mailOptions = {
      from: `"Admin Team" <${process.env.EMAIL_USER}>`,
      to: application.applicant.email,
      subject: `Application Status Update: ${application.job.title}`,
      html: htmlBody,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Mark as notified
    application.notified = true;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Notification email sent to ${application.applicant.email}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { notifyApplicant };

module.exports = {
  adminApplyJob,
  getApplicationsByJob,
  getAllApplications,
  updateApplicationStatus,
  notifyApplicant,
};
