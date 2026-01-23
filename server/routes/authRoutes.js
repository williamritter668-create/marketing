const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);
router.post('/google', authController.googleLogin); // New Google Route
router.get('/check', authController.checkAuth);
router.get('/me', authController.getMe);

module.exports = router;
