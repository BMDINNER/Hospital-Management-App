const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/registerController');

/**
 * User Registration Route
 * 
 * Public endpoint for creating new user accounts.
 * Typically kept separate from auth routes for clarity.
 */

/**
 * @route POST /api/auth/register
 * @desc Create new user account
 * @access Public
 */
router.post('/', registerUser);

module.exports = router;