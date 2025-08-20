const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a job title"],
    },
    description: {
      type: String,
      required: [true, "Please add a job description"],
    },
    skills: {
      type: [String], // array of skills
      required: [true, "Please add required skills"],
    },
    location: {
      type: String,
      required: [true, "Please add job location"],
    },
    salary: {
      type: Number,
      required: [true, "Please add salary details"],
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
      default: "Full-time",
    },
    experience: {
      type: String,
      enum: ["Fresher", "0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"],
      default: "Fresher",
    },
    companyImage: {
      type: String, // Cloudinary URL
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // which admin created this job
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
