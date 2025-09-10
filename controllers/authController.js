const User = require("../models/User");
const admin = require("../config/firebaseAdmin");
const nodemailer = require("nodemailer");

// 🔹 Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Send Welcome Email
const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"FIIT JOBS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to FIIT JOBS 🎉",
      html: `
        <h2>Hi ${name},</h2>
        <p>🎉 Welcome to <b>FIIT-JOBS</b>!</p>
        <p>Your account has been created successfully. You can now explore job opportunities and apply directly.</p>
        <br/>
        <p>Best regards,<br/>The FIIT JOBS Team</p>
      `,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

// 🔹 Local Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      provider: "local",
    });

    // Send Welcome Email
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

module.exports = { registerUser, loginUser, googleAuth };
