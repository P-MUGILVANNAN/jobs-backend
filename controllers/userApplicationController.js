const Application = require("../models/Application");
const Job = require("../models/Job");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// 🔹 Nodemailer transporter with SendGrid
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // this is literal string "apikey"
    pass: process.env.SENDGRID_API_KEY, // your actual SendGrid API key
  },
});

// 🔹 User applies for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id; // from protect middleware
    const userEmail = req.user.email; // assuming email is stored in req.user

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({ job: jobId, applicant: userId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "You already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // Send confirmation email via SendGrid
    const mailOptions = {
      from: `"FIIT JOBS" <${process.env.FROM_EMAIL}>`, // Set this in your .env
      to: userEmail, // applicant's email
      subject: `📩 Application Submitted - ${job.title} at ${job.location}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2c3e50; text-align: center;">Application Submitted ✅</h2>
          
          <p style="font-size: 16px; color: #333;">Hi <b>${req.user.name}</b>,</p>
          <p style="font-size: 15px; color: #333;">
            Thank you for applying for the role of <strong>${job.title}</strong> in <strong>${job.location}</strong>.
          </p>

          <div style="background: #f4f6f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="font-size: 15px; margin: 0; color: #444;">
              📌 <strong>Job Title:</strong> ${job.title}<br/>
              📍 <strong>Location:</strong> ${job.location}
            </p>
          </div>

          <p style="font-size: 15px; color: #333;">
            We have successfully received your application. Our team (or the employer) will review your profile and get back to you soon.
          </p>

          <div style="text-align: center; margin: 25px 0;">
            <a href="https://fiitjobs.com/applications" 
               style="background: #007bff; color: white; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
              View My Applications 🔎
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
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully. Confirmation email sent.",
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get all jobs applied by the logged-in user
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .populate("job", "title companyName location")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { applyForJob, getUserApplications };
