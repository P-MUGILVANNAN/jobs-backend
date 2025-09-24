const User = require("../models/User");
const admin = require("../config/firebaseAdmin");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
const crypto = require("crypto");
const Brevo = require("@getbrevo/brevo");

// 🔹 Setup Brevo API client
const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY   // 👉 use Brevo API key, not SMTP key
);

// 🔹 Send Welcome Email
const sendWelcomeEmail = async (email, name) => {
  try {
    const emailData = {
      sender: { name: "FIIT JOBS", email: process.env.EMAIL_USER },
      to: [{ email, name }],
      subject: "🎉 Welcome to FIIT JOBS - Let’s Get Started!",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2c3e50; text-align: center;">Welcome to FIIT JOBS 🎉</h2>
          <p style="font-size: 16px; color: #333;">Hi <b>${name}</b>,</p>
          <p style="font-size: 15px; color: #333;">
            We’re excited to have you on board! Your account has been created successfully, and you can now start exploring thousands of job opportunities tailored for you.
          </p>

          <div style="text-align: center; margin: 25px 0;">
            <a href="https://fiitjobs.com/login" 
               style="background: #28a745; color: white; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
              Explore Jobs 🚀
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            👉 Here’s what you can do next:
            <ul style="margin-top: 8px; color: #555;">
              <li>Complete your profile to stand out</li>
              <li>Upload your resume for quick applications</li>
              <li>Apply to jobs that match your skills</li>
            </ul>
          </p>

          <hr style="margin: 25px 0;" />
          <p style="font-size: 13px; color: #777; text-align: center;">
            Need help? Reach out at 
            <a href="mailto:support@fiitjobs.com">support@fiitjobs.com</a>
          </p>
          <p style="text-align: center; font-size: 12px; color: #aaa;">
            © ${new Date().getFullYear()} FIIT JOBS. All rights reserved.
          </p>
        </div>
      `,
    };
    await brevoClient.sendTransacEmail(emailData);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

// 🔹 Send OTP to Email
const sendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // save in DB with expiry (5 minutes)
    await Otp.create({
      name,
      email,
      password,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // send email
    const emailData = {
      sender: { name: "FIIT JOBS", email: process.env.EMAIL_USER },
      to: [{ email, name }],
      subject: "🔐 Verify Your Email - FIIT JOBS",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2c3e50; text-align: center;">Welcome to FIIT JOBS 🎉</h2>
          <p style="font-size: 16px; color: #333;">Hi <b>${name}</b>,</p>
          <p style="font-size: 15px; color: #333;">
            Thank you for signing up with <b>FIIT JOBS</b>. To complete your registration, please verify your email by using the One-Time Password (OTP) below:
          </p>
          
          <div style="text-align: center; margin: 25px 0;">
            <div style="display: inline-block; background: #007bff; color: white; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 6px; letter-spacing: 3px;">
              ${otp}
            </div>
          </div>
          
          <p style="font-size: 14px; color: #555; text-align: center;">
            ⚠️ This OTP will expire in <b>5 minutes</b>. Do not share it with anyone for security reasons.
          </p>
          
          <hr style="margin: 25px 0;" />
          <p style="font-size: 13px; color: #777; text-align: center;">
            If you did not request this, please ignore this email.<br/>
            For support, contact us at <a href="mailto:support@fiitjobs.com">support@fiitjobs.com</a>
          </p>
          <p style="text-align: center; font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} FIIT JOBS. All rights reserved.</p>
        </div>
      `,
    };

    await brevoClient.sendTransacEmail(emailData);

    res.json({ message: "OTP sent successfully to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};


const verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // find OTP record
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // create user now with stored data
    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      role: "user", // default
      provider: "local",
    });

    // delete otp record after success
    await Otp.deleteMany({ email });

    // send welcome email
    sendWelcomeEmail(user.email, user.name);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      token: user.getSignedJwtToken(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Local Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, provider: "local" }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      token: user.getSignedJwtToken(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Google Auth (Signup / Login)
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ email, provider: "google" });

    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        provider: "google",
        googleId: uid,
        avatar: picture,
      });

      // Send Welcome Email
      sendWelcomeEmail(user.email, user.name);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      avatar: user.avatar,
      token: user.getSignedJwtToken(),
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

module.exports = { sendOtp, verifyOtpAndRegister, loginUser, googleAuth };