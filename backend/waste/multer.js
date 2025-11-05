// ✅ What happens here:

// When a user uploads a file, Multer sends it directly to Cloudinary.

// Cloudinary returns a secure URL (like https://res.cloudinary.com/...).

// That URL is automatically available at req.file.path.

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // import your cloudinary.js

// Define storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_profiles", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Create multer instance
const upload = multer({ storage: storage });

module.exports = upload;
