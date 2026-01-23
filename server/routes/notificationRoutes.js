const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) return next();
    res.status(401).json({ success: false, message: 'Unauthorized' });
};

router.use(isAuthenticated);

router.get('/', notificationController.getNotifications);
router.post('/mark-read', notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);

module.exports = router;
