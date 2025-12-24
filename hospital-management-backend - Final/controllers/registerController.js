const User = require('../model/Users');
const bcrypt = require('bcrypt');

/**
 * Registers a new user in the system.
 * 
 * Validates required fields, checks for duplicate email addresses, hashes the password,
 * and creates a new user document with the provided information. Returns the created
 * user data without sensitive information.
 * 
 * @async
 * @function registerUser
 * @param {Object} req - Express request object
 * @param {Object} req.body - User registration data
 * @param {string} req.body.email - User email address (required)
 * @param {string} req.body.password - User password (required)
 * @param {string} req.body.name - User first name (required)
 * @param {string} req.body.surname - User last name (required)
 * @param {number} [req.body.height] - User height in centimeters
 * @param {number} [req.body.weight] - User weight in kilograms
 * @param {number} [req.body.age] - User age in years
 * @param {string} [req.body.gender] - User gender
 * @param {string} [req.body.bloodGroup] - User blood group
 * @param {string[]} [req.body.allergies] - User allergy list
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with registration result
 * 
 * @example
 * // HTTP POST /api/auth/register
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword123",
 *   "name": "John",
 *   "surname": "Doe",
 *   "height": 175,
 *   "weight": 70,
 *   "age": 30,
 *   "gender": "male",
 *   "bloodGroup": "O+",
 *   "allergies": ["penicillin", "peanuts"]
 * }
 * 
 * @response {Object} 201 - User registered successfully
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Success message
 * @response {Object} response.user - Created user data (non-sensitive)
 * @response {string} response.user.id - User identifier
 * @response {string} response.user.email - User email address
 * @response {string} response.user.name - User first name
 * @response {string} response.user.surname - User last name
 * 
 * @response {Object} 400 - Missing required fields or validation error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * @response {string[]} [response.errors] - Validation error details
 * 
 * @response {Object} 409 - Email address already exists
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @security
 * - Passwords are hashed using bcrypt with salt rounds 10
 * - Email addresses are normalized to lowercase and trimmed
 * - Default role 'User: 2000' is assigned to new users
 */
const registerUser = async (req, res) => {
  const { email, password, name, surname, height, weight, age, gender, bloodGroup, allergies } = req.body;

  if (!email || !password || !name || !surname) {
    return res.status(400).json({ 
      success: false,
      message: 'Email, password, name, and surname are required.' 
    });
  }

  try {
    const duplicate = await User.findOne({ email: email.toLowerCase() }).exec();
    if (duplicate) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already exists!' 
      });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPwd,
      name: name.trim(),
      surname: surname.trim(),
      height,
      weight,
      age,
      gender,
      bloodGroup,
      allergies,
      roles: { User: 2000 }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: { 
        id: newUser._id, 
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists!'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error!'
    });
  }
};

module.exports = { registerUser };