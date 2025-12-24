const express = require('express');
const router = express.Router();
const { logout } = require('../controllers/logoutController');

/**
 * Logout Route
 * 
 * Handles user session termination.
 * Note: Requires refresh token cookie for proper logout.
 */

/**
 * @route POST /api/auth/logout
 * @desc Invalidate refresh token and clear session cookie
 * @access Public (but requires valid refresh token cookie)
 */
router.post('/', logout);

module.exports = router;