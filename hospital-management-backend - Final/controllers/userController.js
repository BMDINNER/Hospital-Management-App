const User = require('../model/Users');

/**
 * Retrieves the authenticated user's profile information.
 * 
 * Returns user data excluding sensitive fields like password and refresh token.
 * Requires authentication middleware to set req.userId.
 * 
 * @async
 * @function getUserProfile
 * @param {Object} req - Express request object
 * @param {string} req.userId - Authenticated user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with user profile data
 * 
 * @example
 * // HTTP GET /api/users/profile
 * 
 * @response {Object} 200 - Profile retrieved successfully
 * @response {boolean} response.success - Operation status
 * @response {Object} response.user - User profile data
 * @response {string} response.user._id - User identifier
 * @response {string} response.user.email - User email address
 * @response {string} response.user.name - User first name
 * @response {string} response.user.surname - User last name
 * @response {number} [response.user.height] - Height in centimeters
 * @response {number} [response.user.weight] - Weight in kilograms
 * @response {number} [response.user.age] - Age in years
 * @response {string} [response.user.gender] - Gender identifier
 * @response {string} [response.user.bloodGroup] - Blood group classification
 * @response {string[]} [response.user.allergies] - List of known allergies
 * @response {Object} [response.user.roles] - User role permissions
 * @response {Object[]} [response.user.appointments] - User appointment history
 * @response {Date} [response.user.createdAt] - Account creation timestamp
 * @response {Date} [response.user.updatedAt] - Last profile update timestamp
 * 
 * @response {Object} 404 - User not found
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password -refreshToken')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Validates user profile update data.
 * 
 * @private
 * @function validateProfileUpdate
 * @param {Object} data - Profile update data to validate
 * @param {string} [data.name] - Updated first name
 * @param {string} [data.surname] - Updated last name
 * @param {number} [data.height] - Updated height in centimeters
 * @param {number} [data.weight] - Updated weight in kilograms
 * @param {number} [data.age] - Updated age in years
 * @param {string} [data.gender] - Updated gender identifier
 * @param {string} [data.bloodGroup] - Updated blood group classification
 * @param {string[]} [data.allergies] - Updated allergy list
 * @returns {string[]} Array of validation error messages (empty if valid)
 */
const validateProfileUpdate = (data) => {
  const errors = [];
  
  if (data.name !== undefined && data.name.trim() === '') {
    errors.push('Name cannot be empty');
  }
  
  if (data.surname !== undefined && data.surname.trim() === '') {
    errors.push('Surname cannot be empty');
  }
  
  if (data.height !== undefined && (data.height < 0 || data.height > 300)) {
    errors.push('Height must be between 0 and 300 cm');
  }
  
  if (data.weight !== undefined && (data.weight < 0 || data.weight > 500)) {
    errors.push('Weight must be between 0 and 500 kg');
  }
  
  if (data.age !== undefined && (data.age < 0 || data.age > 120)) {
    errors.push('Age must be between 0 and 120');
  }
  
  if (data.gender !== undefined && !['male', 'female', 'other', 'prefer-not-to-say'].includes(data.gender)) {
    errors.push('Invalid gender value');
  }
  
  if (data.bloodGroup !== undefined &&
    !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    .includes(data.bloodGroup)) {
    errors.push('Invalid blood group');
  }
  
  return errors;
};

/**
 * Updates the authenticated user's profile information.
 * 
 * Validates update data, applies allowed updates to the user document,
 * and returns the updated profile excluding sensitive fields.
 * 
 * @async
 * @function updateUserProfile
 * @param {Object} req - Express request object
 * @param {Object} req.body - Profile update data
 * @param {string} [req.body.name] - Updated first name
 * @param {string} [req.body.surname] - Updated last name
 * @param {number} [req.body.height] - Updated height in centimeters
 * @param {number} [req.body.weight] - Updated weight in kilograms
 * @param {number} [req.body.age] - Updated age in years
 * @param {string} [req.body.gender] - Updated gender identifier
 * @param {string} [req.body.bloodGroup] - Updated blood group classification
 * @param {string[]} [req.body.allergies] - Updated allergy list
 * @param {string} req.userId - Authenticated user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with updated profile data
 * 
 * @example
 * // HTTP PATCH /api/users/profile
 * {
 *   "name": "John",
 *   "surname": "Smith",
 *   "height": 180,
 *   "weight": 75,
 *   "age": 35,
 *   "gender": "male",
 *   "bloodGroup": "O+",
 *   "allergies": ["penicillin"]
 * }
 * 
 * @response {Object} 200 - Profile updated successfully
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Success message
 * @response {Object} response.user - Updated user profile data (excluding sensitive fields)
 * 
 * @response {Object} 400 - Validation failed
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * @response {string[]} response.errors - Validation error details
 * 
 * @response {Object} 404 - User not found
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const updateUserProfile = async (req, res) => {
  try {
    const validationErrors = validateProfileUpdate(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const allowedUpdates = [
      'name', 'surname', 'height', 'weight', 'age', 'gender', 'bloodGroup', 'allergies'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'name' || field === 'surname' || field === 'allergies') {
          user[field] = req.body[field].trim();
        } else {
          user[field] = req.body[field];
        }
      }
    });

    await user.save();

    const updatedUser = await User
    .findById(req.userId)
    .select('-password -refreshToken');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update user profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};