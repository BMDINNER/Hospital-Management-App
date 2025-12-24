const User = require('../model/Users');

/**
 * Handles user logout by invalidating refresh token.
 * 
 * Clears the JWT refresh token from both the user's record in the database
 * and the HTTP-only cookie. Returns appropriate status codes based on the
 * presence of the refresh token cookie.
 * 
 * @async
 * @function logout
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - HTTP request cookies
 * @param {string} [req.cookies.jwt] - JWT refresh token cookie
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with logout status
 * 
 * @example
 * // HTTP POST /api/auth/logout
 * 
 * @response {Object} 200 - Logout successful
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Success message
 * 
 * @response {Object} 204 - No refresh token present
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Status message
 * 
 * @response {Object} 500 - Logout processing error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @security
 * - Requires valid refresh token cookie
 * - Clears HTTP-only cookie with secure options
 * - Invalidates refresh token in database
 */
const logout = async (req, res) => {
  const cookies = req.cookies;
  
  if (!cookies?.jwt) {
    return res.status(204).json({
      success: true,
      message: 'No content'
    });
  }

  const refreshToken = cookies.jwt;

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();
    
    if (foundUser) {
      foundUser.refreshToken = '';
      await foundUser.save();
    }

    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })
    .status(200)
    .json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

module.exports = { logout };