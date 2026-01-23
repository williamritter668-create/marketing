const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.post('/', isAuthenticated, isAdmin, userController.createUser);
router.post('/:id/credits', isAuthenticated, isAdmin, userController.addUserCredits);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
