const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Medication Sub-Schema (Embedded)
 * 
 * Note: This is a duplicate of the medication schema in Prescription.js.
 * Consider extracting to a shared module if used in multiple places.
 * 
 * @typedef {Object} Medication
 * @property {string} name - Brand name of medication
 * @property {string} [genericName] - Generic/scientific name
 * @property {string} dosage - Prescribed dosage
 * @property {string} frequency - Administration frequency
 * @property {string} duration - Treatment duration
 * @property {string} [category] - Therapeutic classification
 * @property {string} [instructions] - Special instructions
 */
const medicationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  instructions: {
    type: String
  }
});

/**
 * Appointment Sub-Schema (Embedded)
 * 
 * Appointment records embedded within user documents for performance.
 * Denormalized structure reduces joins for common queries.
 * 
 * @typedef {Object} Appointment
 * @property {ObjectId} hospitalId - Reference to Hospital
 * @property {string} hospitalName - Denormalized hospital name
 * @property {ObjectId} departmentId - Reference to Department
 * @property {string} department - Denormalized department name
 * @property {ObjectId} doctorId - Reference to Doctor
 * @property {string} doctorName - Denormalized doctor name
 * @property {Date} appointmentDate - Scheduled appointment date
 * @property {string} appointmentTime - Scheduled time (HH:MM)
 * @property {string} [location] - Appointment location/address
 * @property {string} status - Current appointment state
 * @property {Date} createdAt - Appointment creation timestamp
 * @property {Date} [actualStartTime] - Actual start time
 * @property {Date} [actualEndTime] - Actual end time
 * @property {ObjectId} [slotId] - Reference to AppointmentSlot
 * @property {ObjectId} [prescriptionId] - Reference to Prescription
 * @property {string} [notes] - Appointment notes/comments
 */
const appointmentSchema = new Schema({
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  hospitalName: {
    type: String,
    required: true,
    trim: true
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: true,
    index: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'confirmed',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  actualStartTime: Date,
  actualEndTime: Date,
  slotId: {
    type: Schema.Types.ObjectId,
    ref: 'AppointmentSlot'
  },
  prescriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  notes: String
});

/**
 * User Mongoose Schema
 * 
 * Primary user/patient data model for the hospital management system.
 * Contains authentication credentials, personal information, medical history,
 * and embedded appointment records.
 * 
 * @typedef {Object} User
 * @property {string} email - Primary email (unique, indexed)
 * @property {string} password - Hashed password
 * @property {string} name - First/given name
 * @property {string} surname - Last/family name
 * @property {number} [height] - Height in centimeters
 * @property {number} [weight] - Weight in kilograms
 * @property {number} [age] - Age in years
 * @property {string} gender - Gender identity
 * @property {string} bloodGroup - Blood type classification
 * @property {string} allergies - Known allergy information
 * @property {string} [profilePicture] - Profile image URL/path
 * @property {Object} roles - User permission levels
 * @property {number} roles.User - Base user role (default: 2000)
 * @property {number} [roles.Admin] - Admin role level
 * @property {string} [refreshToken] - JWT refresh token
 * @property {Appointment[]} appointments - Embedded appointment history
 * @property {Date} [lastLogin] - Most recent login timestamp
 * @property {boolean} isActive - Account status flag
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const userSchema = new Schema({
  /**
   * Email - primary contact and authentication identifier.
   * Unique constraint prevents duplicate accounts.
   * 
   * @type {string}
   * @required Email is required
   * @unique
   * @lowercase
   * @trim
   * @index
   * @pattern /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
   */
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  /**
   * Password - hashed authentication secret.
   * Minimum length enforced for security.
   * 
   * @type {string}
   * @required Password is required
   * @minlength 6
   */
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  /**
   * First name - personal identifier.
   * 
   * @type {string}
   * @required Name is required
   * @trim
   */
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  
  /**
   * Last name - family/surname.
   * 
   * @type {string}
   * @required Surname is required
   * @trim
   */
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true
  },
  
  /**
   * Height - in centimeters for medical records.
   * Practical limits enforced for data quality.
   * 
   * @type {number}
   * @minimum 0
   * @maximum 300
   */
  height: {
    type: Number,
    min: [0, 'Height cannot be negative'],
    max: [300, 'Height cannot exceed 300cm']
  },
  
  /**
   * Weight - in kilograms for BMI calculations.
   * 
   * @type {number}
   * @minimum 0
   * @maximum 500
   */
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    max: [500, 'Weight cannot exceed 500kg']
  },
  
  /**
   * Age - in years for demographic analysis.
   * 
   * @type {number}
   * @minimum 0
   * @maximum 120
   */
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot exceed 120']
  },
  
  /**
   * Gender - self-identified gender.
   * Includes 'prefer-not-to-say' option for privacy.
   * 
   * @type {string}
   * @enum ['male', 'female', 'other', 'prefer-not-to-say']
   * @default 'prefer-not-to-say'
   */
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  
  /**
   * Blood group - medical information for emergencies.
   * Empty string default for unknown/undeclared.
   * 
   * @type {string}
   * @enum ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
   * @default ''
   */
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
    default: ''
  },
  
  /**
   * Allergies - free-text field for medical conditions.
   * Consider restructuring as array if need structured data.
   * 
   * @type {string}
   * @default ''
   * @trim
   */
  allergies: {
    type: String,
    default: '',
    trim: true
  },
  
  /**
   * Profile picture - avatar image reference.
   * Store URL or file path based on implementation.
   * 
   * @type {string}
   */
  profilePicture: String,
  
  /**
   * Roles - permission levels using numeric codes.
   * RBAC (Role-Based Access Control) pattern.
   * Default user role: 2000 (standard permissions).
   * 
   * @type {Object}
   */
  roles: {
    User: {
      type: Number,
      default: 2000
    },
    Admin: {
      type: Number,
      default: 0
    }
  },
  
  /**
   * Refresh token - JWT token for session renewal.
   * Indexed for efficient logout/token management.
   * 
   * @type {string}
   * @index
   */
  refreshToken: {
    type: String,
    index: true
  },
  
  /**
   * Appointments - embedded appointment history.
   * Denormalized for performance in common queries.
   * Consider archiving old appointments if collection grows large.
   * 
   * @type {Appointment[]}
   */
  appointments: [appointmentSchema],
  
  /**
   * Last login - timestamp of most recent authentication.
   * Useful for security monitoring and user engagement.
   * 
   * @type {Date}
   */
  lastLogin: Date,
  
  /**
   * Active status - soft delete flag.
   * Set false for deactivated/suspended accounts.
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
   * @property {boolean} timestamps - Auto-managed createdAt/updatedAt
   */
  timestamps: true
});

/**
 * Compound index - optimizes appointment status queries per user.
 * Useful for dashboards showing appointment counts by status.
 */
userSchema.index({ 'appointments.status': 1 });

/**
 * Compound index - optimizes date-based appointment queries.
 * Supports upcoming/past appointment filtering.
 */
userSchema.index({ 'appointments.appointmentDate': 1 });

/**
 * Index - sorts users by creation date (newest first).
 * Common for admin user management interfaces.
 */
userSchema.index({ createdAt: -1 });

/**
 * User Model
 * 
 * @constant {mongoose.Model}
 * @name User
 */
module.exports = mongoose.model('User', userSchema);