const jwt = require('jsonwebtoken');

/**
 * Express middleware for verifying JSON Web Tokens (JWT).
 * 
 * Extracts and validates JWT from the Authorization header, verifies its
 * signature using the configured secret, and attaches decoded token data
 * to the request object for use in subsequent middleware and route handlers.
 * 
 * @function verifyJWT
 * @param {Object} req - Express request object
 * @param {Object} req.headers - HTTP request headers
 * @param {string} [req.headers.authorization] - Authorization header
 * @param {string} [req.headers.Authorization] - Alternative authorization header (case-insensitive)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void|Object} Calls next() on successful verification or sends error response
 * 
 * @example
 * // Usage in Express route definition
 * const verifyJWT = require('./middleware/verifyJWT');
 * 
 * app.get('/api/protected-route', verifyJWT, (req, res) => {
 *   // Access user data from verified token
 *   const userId = req.userId;
 *   const userEmail = req.userEmail;
 *   const userRoles = req.userRoles;
 *   // ... route handler logic
 * });
 * 
 * @throws {401} Unauthorized - Missing or malformed Authorization header
 * @throws {403} Forbidden - Invalid, expired, or tampered JWT
 * 
 * @requires
 * - `process.env.ACCESS_TOKEN_SECRET` must be set with JWT signing secret
 * - Authorization header must follow format: `Bearer <token>`
 * 
 * @property {string} req.userId - User identifier extracted from JWT payload
 * @property {string} req.userEmail - User email extracted from JWT payload
 * @property {Object|Array} req.userRoles - User roles/permissions extracted from JWT payload
 */
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Invalid or expired token'
        });
      }
      
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      req.userRoles = decoded.roles;
      next();
    }
  );
};

module.exports = verifyJWT;