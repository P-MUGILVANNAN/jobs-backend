const Application = require("../models/Application");
const Job = require("../models/Job");
const Brevo = require("@getbrevo/brevo");

// 🔹 Setup Brevo API client
const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY   // 👉 use Brevo API key, not SMTP key
);

// 🔹 Send Job Application Confirmation Email
const sendApplicationConfirmationEmail = async (user, job) => {
  try {
    const emailData = {
      sender: { name: "FIIT JOBS", email: process.env.EMAIL_USER },
      to: [{ email: user.email, name: user.name }],
      subject: `📩 Application Submitted - ${job.title} at ${job.companyName}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2c3e50; text-align: center;">Application Submitted ✅</h2>
          
          <p style="font-size: 16px; color: #333;">Hi <b>${user.name}</b>,</p>
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
            We have successfully received your application. Our team will review your profile and get back to you soon.
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
    await brevoClient.sendTransacEmail(emailData);
    console.log(`Application confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending application email:", error.message);
  }
};

// 🔹 User applies for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = req.user; // Assuming req.user contains user object from middleware

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const existing = await Application.findOne({ job: jobId, applicant: user._id });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "You have already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: user._id,
    });

    sendApplicationConfirmationEmail(user, job);

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