const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Middleware to ensure user is authenticated
const isAuthenticated = (req, res, next) => {
    // Debug Logging for Auth
    console.log(`🛡️ Auth Check | SessionID: ${req.sessionID} | User: ${req.session?.user?.email || 'None'}`);

    if (req.session && req.session.user) {
        return next();
    }

    console.warn("⚠️ Blocked Unauthorized Request to AI Route");
    return res.status(401).json({ success: false, message: 'Unauthorized. Please login again.' });
};

// POST /api/ai/generate
router.post('/generate', isAuthenticated, aiController.generate);

module.exports = router;
