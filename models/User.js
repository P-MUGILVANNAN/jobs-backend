const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    // 🔹 Basic Account Info
    name: {
      type: String,
      required: function () {
        return this.provider === "local"; // required only for local signup
      },
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local"; // required only for local signup
      },
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String, // Firebase UID / Google unique ID
      required: function () {
        return this.provider === "google";
      },
    },
    avatar: {
      type: String, // Google/local profile picture
    },

    // 🔹 Category (extended field)
    category: {
      type: String,
      enum: [
        "jobseeker",
        "fresher",
        "housewife",
        "student",
        "experienced",
        "freelancer",
        "career break",
        "others",
      ],
      default: "jobseeker",
    },

    // 🔹 Extended Profile Section
    profileImage: {
      type: String, // custom profile image
    },
    coverImage: {
      type: String, // cover banner image
    },
    about: {
      type: String, // short bio / summary
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    skills: [String],
    experience: {
      type: String, // e.g. "2-4 years"
    },

    // 🔹 Education (multiple entries allowed)
    education: [
      {
        level: { type: String }, // e.g. "10th", "12th", "B.Sc", "MCA"
        institution: { type: String },
        startYear: { type: String },
        endYear: { type: String },
        grade: { type: String }, // optional
      },
    ],

    // 🔹 Projects (multiple projects allowed)
    projects: [
      {
        projectName: { type: String, required: true },
        description: { type: String },
        liveLink: { type: String },
        githubLink: { type: String },
        duration: { type: String }, // e.g. "Jan 2023 - Mar 2023"
      },
    ],

    // 🔹 Resume & Job Applications
    resume: {
      type: String, // store file path or cloud URL
    },
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    // 🔹 Admin flagging
    isSuspicious: {
      type: Boolean,
      default: false, // admin can flag/delete later
    },
  },
  { timestamps: true }
);

// 🔹 Hash password only if local signup
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.provider !== "local") {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔹 Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, provider: this.provider },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = mongoose.model("User", userSchema);
