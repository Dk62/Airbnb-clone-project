const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (!process.env.CLOUD_API_KEY) {
  throw new Error("CLOUD_API_KEY is missing from environment variables. Please check your .env file.");
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_Dev',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

module.exports = {
    storage,
    cloudinary
};