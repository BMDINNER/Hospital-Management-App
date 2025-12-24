const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Availability Schema
 * 
 * Defines weekly schedule patterns for doctors' working hours.
 * 
 * @typedef {Object} Availability
 * @property {number} dayOfWeek - Day of week (0=Sunday, 6=Saturday)
 * @property {string} startTime - Shift start time (HH:MM format)
 * @property {string} endTime - Shift end time (HH:MM format)
 * @property {boolean} isAvailable - Current availability status
 */
const availabilitySchema = new Schema({
  /**
   * Day of week - numeric representation (0-6).
   * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
   * 
   * @type {number}
   * @required
   * @minimum 0
   * @maximum 6
   */
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  
  /**
   * Start time - beginning of shift in 24-hour format.
   * 
   * @type {string}
   * @required
   * @pattern ^([01]\d|2[0-3]):([0-5]\d)$
   */
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: 'Invalid time format. Use HH:MM'
    }
  },
  
  /**
   * End time - conclusion of shift in 24-hour format.
   * 
   * @type {string}
   * @required
   * @pattern ^([01]\d|2[0-3]):([0-5]\d)$
   */
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: 'Invalid time format. Use HH:MM'
    }
  },
  
  /**
   * Availability flag - temporary toggle for specific time slots.
   * Useful for marking vacation, sick leave, or temporary unavailability.
   * 
   * @type {boolean}
   * @default true
   */
  isAvailable: {
    type: Boolean,
    default: true
  }
});

/**
 * Doctor Mongoose Schema
 * 
 * Defines medical practitioner profiles within the hospital system.
 * Doctors belong to departments and hospitals, with defined schedules and specialties.
 * 
 * @typedef {Object} Doctor
 * @property {string} name - Doctor's full name
 * @property {string} specialty - Medical specialty/field
 * @property {mongoose.Types.ObjectId} department - Department reference
 * @property {mongoose.Types.ObjectId} hospital - Hospital reference
 * @property {string} [email] - Contact email
 * @property {string} [phone] - Contact phone number
 * @property {number} [experience] - Years of professional experience
 * @property {string[]} [qualifications] - Academic/professional qualifications
 * @property {Availability[]} [availability] - Weekly schedule patterns
 * @property {number} consultationFee - Standard consultation fee
 * @property {number} appointmentDuration - Default appointment length (minutes)
 * @property {boolean} isActive - Doctor's active status
 * @property {Date} createdAt - Document creation timestamp
 * @property {Date} updatedAt - Document update timestamp
 */
const doctorSchema = new Schema({
  /**
   * Doctor's full name - display name for patient-facing interfaces.
   * 
   * @type {string}
   * @required
   * @trim
   */
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  /**
   * Medical specialty - specific field of practice.
   * e.g., "Cardiologist", "Neurologist", "Orthopedic Surgeon"
   * 
   * @type {string}
   * @required
   * @trim
   */
  specialty: {
    type: String,
    required: true,
    trim: true
  },
  
  /**
   * Department reference - links doctor to their medical department.
   * 
   * @type {mongoose.Types.ObjectId}
   * @required
   * @ref Department
   * @index
   */
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    index: true
  },
  
  /**
   * Hospital reference - primary hospital where doctor practices.
   * 
   * @type {mongoose.Types.ObjectId}
   * @required
   * @ref Hospital
   * @index
   */
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    index: true
  },
  
  /**
   * Contact email - professional email address.
   * 
   * @type {string}
   * @trim
   * @lowercase
   */
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  /**
   * Contact phone - professional phone number.
   * 
   * @type {string}
   * @trim
   */
  phone: {
    type: String,
    trim: true
  },
  
  /**
   * Experience - years of professional practice.
   * 
   * @type {number}
   * @minimum 0
   */
  experience: {
    type: Number,
    min: 0
  },
  
  /**
   * Qualifications - array of degrees, certifications, specializations.
   * e.g., ["MD", "Board Certified Cardiologist", "Fellow of American College of Cardiology"]
   * 
   * @type {string[]}
   */
  qualifications: [String],
  
  /**
   * Weekly availability - recurring schedule patterns.
   * 
   * @type {Availability[]}
   */
  availability: [availabilitySchema],
  
  /**
   * Consultation fee - standard charge for appointments.
   * Stored as number (currency amount).
   * 
   * @type {number}
   * @minimum 0
   * @default 0
   */
  consultationFee: {
    type: Number,
    min: 0,
    default: 0
  },
  
  /**
   * Appointment duration - default time slot length in minutes.
   * Used for scheduling and slot generation.
   * 
   * @type {number}
   * @minimum 5
   * @maximum 120
   * @default 30
   */
  appointmentDuration: {
    type: Number,
    min: 5,
    max: 120,
    default: 30
  },
  
  /**
   * Active status - controls doctor visibility in listings.
   * Set false for doctors on leave, retired, or no longer practicing.
   * 
   * @type {boolean}
   * @default true
   * @index
   */
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  /**
   * Schema options
   * 
   * @property {boolean} timestamps - Auto-managed timestamp fields
   */
  timestamps: true
});

/**
 * Compound index - optimizes queries filtering doctors by hospital and department.
 * Essential for appointment booking flows.
 */
doctorSchema.index({ hospital: 1, department: 1, isActive: 1 });

/**
 * Text index - enables full-text search on doctor names and specialties.
 * Supports patient search functionality.
 */
doctorSchema.index({ name: 'text', specialty: 'text' });

/**
 * Doctor Model
 * 
 * @constant {mongoose.Model}
 * @name Doctor
 */
module.exports = mongoose.model('Doctor', doctorSchema);