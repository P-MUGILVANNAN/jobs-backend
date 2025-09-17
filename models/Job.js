const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please add a company name"],
    },
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
    qualification: {
      type: String,
      required: [true, "Please add qualification"],
    },
    category: {
      type: String,
      enum: [
        "Networking",
        "Linux",
        "AWS",
        "Accounts",
        "Developer",
        "Designer",
        "DevOps",
        "Testing",
        "Data Analyst",
        "Data Scientist",
      ],
      required: [true, "Please add job category"],
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
      default: "Full-Time",
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