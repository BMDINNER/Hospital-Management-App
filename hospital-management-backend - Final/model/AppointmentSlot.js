const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * AppointmentSlot Mongoose Schema
 * 
 * Defines the data structure for managing appointment time slots within the hospital management system.
 * Each slot represents a specific time interval that can be booked by patients for appointments
 * with doctors at particular hospitals.
 * 
 * @typedef {Object} AppointmentSlot
 * @property {mongoose.Types.ObjectId} doctor - Reference to Doctor model (required)
 * @property {mongoose.Types.ObjectId} hospital - Reference to Hospital model (required)
 * @property {Date} date - Appointment date (required)
 * @property {string} startTime - Slot start time in HH:MM format (required)
 * @property {string} endTime - Slot end time in HH:MM format (required)
 * @property {number} duration - Slot duration in minutes (default: 30)
 * @property {boolean} isBooked - Booking status flag (default: false)
 * @property {boolean} isAvailable - Availability status flag (default: true)
 * @property {mongoose.Types.ObjectId} bookedBy - Reference to User model when booked
 * @property {Date} createdAt - Document creation timestamp (auto-generated)
 * @property {Date} updatedAt - Document update timestamp (auto-generated)
 * 
 * @example
 * // Example AppointmentSlot document
 * {
 *   _id: ObjectId('60d21b4667d0d8992e610c85'),
 *   doctor: ObjectId('60d21b4667d0d8992e610c86'),
 *   hospital: ObjectId('60d21b4667d0d8992e610c87'),
 *   date: 2024-12-25T00:00:00.000Z,
 *   startTime: '09:00',
 *   endTime: '09:30',
 *   duration: 30,
 *   isBooked: false,
 *   isAvailable: true,
 *   bookedBy: null,
 *   createdAt: 2024-12-20T10:30:00.000Z,
 *   updatedAt: 2024-12-20T10:30:00.000Z
 * }
 */
const appointmentSlotSchema = new Schema({
  /**
   * Doctor reference - identifies which doctor this appointment slot belongs to.
   * 
   * @type {mongoose.Types.ObjectId}
   * @required
   * @ref Doctor
   */
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true
  },
  
  /**
   * Hospital reference - identifies which hospital this appointment slot is located at.
   * 
   * @type {mongoose.Types.ObjectId}
   * @required
   * @ref Hospital
   */
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    index: true
  },
  
  /**
   * Appointment date - the calendar date for this appointment slot.
   * Time component is typically set to 00:00:00 to represent the entire day.
   * 
   * @type {Date}
   * @required
   */
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  /**
   * Start time - beginning of the appointment slot in 24-hour HH:MM format.
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
   * End time - conclusion of the appointment slot in 24-hour HH:MM format.
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
   * Duration - length of the appointment slot in minutes.
   * 
   * @type {number}
   * @default 30
   * @minimum 5
   * @maximum 240
   */
  duration: {
    type: Number,
    default: 30,
    min: 5,
    max: 240
  },
  
  /**
   * Booking status - indicates whether this slot has been booked by a patient.
   * 
   * @type {boolean}
   * @default false
   */
  isBooked: {
    type: Boolean,
    default: false,
    index: true
  },
  
  /**
   * Availability status - indicates whether this slot is available for booking.
   * Can be false for maintenance, doctor unavailability, or other reasons.
   * 
   * @type {boolean}
   * @default true
   */
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  
  /**
   * User reference - identifies which user has booked this appointment slot.
   * Null when the slot is not booked.
   * 
   * @type {mongoose.Types.ObjectId}
   * @default null
   * @ref User
   */
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  /**
   * Schema options configuration
   * 
   * @property {boolean} timestamps - Automatically adds createdAt and updatedAt fields
   */
  timestamps: true
});

/**
 * Compound unique index ensures that a doctor cannot have duplicate time slots
 * at the same hospital on the same date and start time.
 */
appointmentSlotSchema.index({ doctor: 1, hospital: 1, date: 1, startTime: 1 }, { unique: true });

/**
 * Compound index optimizes queries for finding available slots on specific dates.
 */
appointmentSlotSchema.index({ date: 1, isAvailable: 1, isBooked: 1 });

/**
 * Compound index optimizes queries for finding available slots for specific doctors.
 */
appointmentSlotSchema.index({ doctor: 1, date: 1, isAvailable: 1 });

/**
 * AppointmentSlot Model
 * 
 * @constant {mongoose.Model}
 * @name AppointmentSlot
 */
module.exports = mongoose.model('AppointmentSlot', appointmentSlotSchema);