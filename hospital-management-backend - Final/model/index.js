const mongoose = require('mongoose');

// Import all models - this ensures Mongoose registers all schemas
// Note: Import order matters if there are circular dependencies
require('./Department');
require('./Hospital');
require('./Doctor');
require('./AppointmentSlot');
require('./Medicine');
require('./Prescription');
require('./Users');

/**
 * Central module exports for database models.
 * 
 * This file serves as the main entry point for Mongoose model access throughout the application.
 * By importing all models here, we ensure they're registered with Mongoose before being used elsewhere.
 * 
 * @module models
 * @exports {mongoose} Mongoose instance with all registered models
 * 
 * @example
 * // In other files, import models like this:
 * const mongoose = require('./models');
 * const User = mongoose.model('User');
 * const Doctor = mongoose.model('Doctor');
 * 
 * // Or using destructuring:
 * const { Department, Hospital } = require('./models').models;
 * 
 * @note This approach prevents "Model not registered" errors by centralizing model registration.
 * @warning Avoid circular dependencies between model files.
 */
module.exports = mongoose;