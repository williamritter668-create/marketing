const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { isAuthenticated } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/generate', isAuthenticated, upload.single('image'), projectController.generateProject);
router.get('/', isAuthenticated, projectController.getUserProjects);

module.exports = router;
