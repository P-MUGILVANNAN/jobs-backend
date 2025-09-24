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
      .populate("job", "title location");

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // ✅ Updated Nodemailer transporter to use Resend
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com", // Resend SMTP host
      secure: true, // Use SSL
      port: 465, // Standard port for SSL
      auth: {
        user: "resend", // This is always "resend" for SMTP connections
        pass: process.env.RESEND_API_KEY, // Your Resend API key
      },
    });

    // ✅ Professional HTML email template
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
      <h2 style="color: #2c3e50; text-align: center;">📢 Application Status Update</h2>
      
      <p style="font-size: 16px; color: #333;">Hi <b>${application.applicant.name}</b>,</p>
      <p style="font-size: 15px; color: #333;">
        Your application for the role of <strong>${application.job.title}</strong>${
          application.job.location ? ` in <strong>${application.job.location}</strong>` : ""
        } has been updated.
      </p>

      <div style="background: #f4f6f9; padding: 15px; border-radius: 6px; margin: 20px 0; text-align:center;">
        <p style="font-size: 15px; margin: 0; color: #444;">
          📌 <strong>Status:</strong> <span style="color:#FF5722;">${application.status.toUpperCase()}</span>
        </p>
      </div>

      <p style="font-size: 15px; color: #333;">
        Thank you for applying with us. Please stay tuned for further updates from our team or the employer.
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="https://fiitjobs.com/applications" 
           style="background: #28a745; color: white; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
          View My Applications 📂
        </a>
      </div>

      <hr style="margin: 25px 0;" />
      <p style="font-size: 13px; color: #777; text-align: center;">
        Need assistance? Reach out to us at 
        <a href="mailto:support@fiitjobs.com">support@fiitjobs.com</a>
      </p>
      <p style="text-align: center; font-size: 12px; color: #aaa;">
        © ${new Date().getFullYear()} FIIT JOBS. All rights reserved.
      </p>
    </div>
    `;

    const mailOptions = {
      from: `"FIIT JOBS" <${process.env.RESEND_FROM_EMAIL}>`, // The 'from' email must be a verified domain in Resend
      to: application.applicant.email,
      subject: `📢 Application Status Update - ${application.job.title}`,
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

module.exports = {
  adminApplyJob,
  getApplicationsByJob,
  getAllApplications,
  updateApplicationStatus,
  notifyApplicant,
};