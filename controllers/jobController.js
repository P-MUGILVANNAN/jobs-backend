const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const { companyName, title, description, skills, location, salary, jobType, experience } = req.body;

    if (!companyName || !title || !description || !skills || !location || !salary) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const job = await Job.create({
      companyName,
      title,
      description,
      skills: skills.split(","), // convert CSV string to array
      location,
      salary,
      jobType,
      experience,
      companyImage: req.file ? req.file.path : null, // Cloudinary URL
      createdBy: req.user.id, // from JWT middleware
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get Jobs with Pagination + Filters + Sorting
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      jobType,
      experience,
      location,
      sort = "desc"
    } = req.query;

    const query = {};

    // Apply filters
    if (jobType) query.jobType = jobType;
    if (experience) query.experience = experience;
    if (location) query.location = { $regex: location, $options: "i" };

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch jobs with filters + pagination + sorting
    const jobs = await Job.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: sort === "asc" ? 1 : -1 }) // sort by createdAt
      .skip(skip)
      .limit(Number(limit));

    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      totalJobs,
      page: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only admin who created job can update (optional rule)
    if (job.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    job.title = req.body.title || job.title;
    job.companyName = req.body.companyName || job.companyName;
    job.description = req.body.description || job.description;
    job.skills = req.body.skills ? req.body.skills.split(",") : job.skills;
    job.location = req.body.location || job.location;
    job.salary = req.body.salary || job.salary;
    job.jobType = req.body.jobType || job.jobType;
    job.experience = req.body.experience || job.experience;
    if (req.file) job.companyImage = req.file.path; // update cloudinary image if provided

    const updatedJob = await job.save();
    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
