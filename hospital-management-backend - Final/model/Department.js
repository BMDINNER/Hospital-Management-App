const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Department Mongoose Schema
 * 
 * Defines the structure for medical department/specialty entities within the hospital system.
 * Departments represent medical specialties like Cardiology, Neurology, Orthopedics, etc.
 * 
 * @typedef {Object} Department
 * @property {string} name - Department name (unique, required)
 * @property {string} [description] - Department description
 * @property {boolean} isActive - Department activation status (default: true)
 * @property {Date} createdAt - Document creation timestamp (auto-generated)
 * @property {Date} updatedAt - Document update timestamp (auto-generated)
 * 
 * @example
 * // Example Department document
 * {
 *   _id: ObjectId('60d21b4667d0d8992e610c85'),
 *   name: 'Cardiology',
 *   description: 'Heart and cardiovascular system specialty',
 *   isActive: true,
 *   createdAt: 2024-12-20T10:30:00.000Z,
 *   updatedAt: 2024-12-20T10:30:00.000Z
 * }
 */
const departmentSchema = new Schema({
  /**
   * Department name - unique identifier for the medical specialty.
   * 
   * @type {string}
   * @required
   * @unique
   * @trim
   */
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  /**
   * Department description - optional detailed information about the specialty.
   * 
   * @type {string}
   * @trim
   */
  description: {
    type: String,
    trim: true
  },
  
  /**
   * Active status flag - controls whether the department appears in listings.
   * Can be set to false for deactivated departments while preserving references.
   * 
   * @type {boolean}
   * @default true
   */
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  /**
   * Schema options
   * 
   * @property {boolean} timestamps - Automatically manages createdAt and updatedAt fields
   */
  timestamps: true
});

/**
 * Department Model
 * 
 * @constant {mongoose.Model}
 * @name Department
 */
module.exports = mongoose.model('Department', departmentSchema);