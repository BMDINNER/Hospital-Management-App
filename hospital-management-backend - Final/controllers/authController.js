const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/Users');

/**
 * Authenticates a user and issues JWT tokens.
 * 
 * Validates user credentials, checks account status, and upon successful authentication,
 * generates both access and refresh tokens. The refresh token is stored as an HTTP-only cookie.
 * 
 * @async
 * @function loginUser
 * @param {Object} req - Express request object
 * @param {Object} req.body - Authentication credentials
 * @param {string} req.body.email - User email address
 * @param {string} req.body.password - User password
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with authentication tokens and user data
 * 
 * @example
 * // HTTP POST /api/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword123"
 * }
 * 
 * @response {Object} 200 - Authentication successful
 * @response {boolean} response.success - Operation status
 * @response {string} response.accessToken - JWT access token
 * @response {Object} response.user - User profile data
 * @response {string} response.user.id - User identifier
 * @response {string} response.user.email - User email address
 * @response {string} response.user.name - User first name
 * @response {string} response.user.surname - User last name
 * @response {string[]} response.user.roles - User roles array
 * 
 * @response {Object} 400 - Invalid request parameters
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 401 - Authentication failed
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 403 - Account deactivated
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }

  try {
    const foundUser = await User.findOne({ email: email.toLowerCase().trim() }).exec();

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    if (!foundUser.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const accessToken = jwt.sign(
      {
        userId: foundUser._id,
        email: foundUser.email,
        roles: foundUser.roles
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m' }
    );
  
    const refreshToken = jwt.sign(
      {
        userId: foundUser._id,
        email: foundUser.email
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
    );

    foundUser.refreshToken = refreshToken;
    foundUser.lastLogin = new Date();
    await foundUser.save();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    };

    res.cookie('jwt', refreshToken, cookieOptions);

    res.json({
      success: true,
      accessToken,
      user: {
        id: foundUser._id,
        email: foundUser.email,
        name: foundUser.name,
        surname: foundUser.surname,
        roles: foundUser.roles
      }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { loginUser };