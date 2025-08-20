const express = require("express");
const { getDashboardStats } = require("../controllers/adminDashboardController");

const router = express.Router();

// GET /admin/dashboard/stats
router.get("/dashboard/stats", getDashboardStats);

module.exports = router;
