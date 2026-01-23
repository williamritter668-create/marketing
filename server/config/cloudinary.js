const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

if (process.env.CLOUDINARY_URL) {
    // If CLOUDINARY_URL is provided (e.g. on Railway/Heroku), use it directly
    // Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
    const regex = /^cloudinary:\/\/([^:]+):([^@]+)@([^/]+)$/;
    const match = process.env.CLOUDINARY_URL.match(regex);
    if (match) {
        cloudinary.config({
            cloud_name: match[3],
            api_key: match[1],
            api_secret: match[2]
        });
    } else {
        console.error("❌ Invalid CLOUDINARY_URL format");
    }
} else {
    // Fallback to individual variables
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'adsyria_projects',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
