const cloudinary = require('cloudinary').v2;   // Import Cloudinary library

require('dotenv').config();                    // Load .env file into process.env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,     // Get cloud name from .env
  api_key: process.env.CLOUDINARY_API_KEY,     // Get API key from .env
  api_secret: process.env.CLOUDINARY_API_SECRET// Get API secret from .env
});

module.exports = cloudinary;                   // Export it to use anywhere
