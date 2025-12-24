const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

/**
 * Authentication Routes
 * 
 * Public routes for user authentication.
 * Note: Register route is typically separate for organizational clarity.
 */

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT tokens
 * @access Public
 */
router.post('/', loginUser);

module.exports = router;