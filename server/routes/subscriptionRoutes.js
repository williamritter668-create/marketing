const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/', isAuthenticated, upload.single('receiptImage'), subscriptionController.createSubscription);
router.get('/my-subscriptions', isAuthenticated, subscriptionController.getMySubscriptions);

// Admin Routes
router.get('/', isAuthenticated, isAdmin, subscriptionController.getAllSubscriptions);
router.post('/:id/:action', isAuthenticated, isAdmin, subscriptionController.updateSubscriptionStatus);

module.exports = router;
