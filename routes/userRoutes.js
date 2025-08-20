const express = require("express");
const { updateProfile, getProfile } = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Update Profile
router.put("/update", protect, upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
]), updateProfile);

// get profile
router.get("/profile", protect, getProfile);

module.exports = router;