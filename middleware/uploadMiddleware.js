const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const sanitizeFileName = (filename) => {
  return filename
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isResume = file.fieldname === "resume";
    const baseName = file.originalname
      ? sanitizeFileName(file.originalname.split(".")[0])
      : "file";

    return {
      folder: isResume ? "job-portal/resumes" : "job-portal/images",
      resource_type: isResume ? "raw" : "image",
      allowed_formats: isResume ? undefined : ["jpg", "jpeg", "png"],
      public_id: `${Date.now()}-${baseName}`,
    };
  },
});

const upload = multer({ storage });
module.exports = upload;
