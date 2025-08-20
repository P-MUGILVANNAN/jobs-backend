const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");

// 🔹 Get overall platform stats
const getDashboardStats = async (req, res) => {
  try {
    // Total users (excluding admins)
    const totalUsers = await User.countDocuments({ role: "user" });

    // Total jobs posted
    const totalJobs = await Job.countDocuments();

    // Total applications
    const totalApplications = await Application.countDocuments();

    // Define open jobs as jobs created within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const openJobs = await Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const closedJobs = await Job.countDocuments({ createdAt: { $lt: thirtyDaysAgo } });

    // Popular job categories (group by jobType)
    const jobCategories = await Job.aggregate([
      { $group: { _id: "$jobType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Applications per job
    const applicationsPerJob = await Application.aggregate([
      { $group: { _id: "$job", totalApplicants: { $sum: 1 } } },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $project: {
          _id: 0,
          jobId: "$job._id",
          title: "$job.title",
          totalApplicants: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        openJobs,
        closedJobs,
        jobCategories,
        applicationsPerJob,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getDashboardStats };
