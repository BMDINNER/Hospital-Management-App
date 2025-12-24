const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Medication Sub-Schema
 * 
 * Defines individual medication details within a prescription.
 * Embedded document structure for prescription line items.
 * 
 * @typedef {Object} Medication
 * @property {string} name - Brand name of prescribed medication
 * @property {string} [genericName] - Generic/scientific name
 * @property {string} dosage - Prescribed dosage amount and unit
 * @property {string} frequency - Administration frequency
 * @property {string} duration - Treatment duration
 * @property {string} [category] - Medication therapeutic class
 * @property {string} [instructions] - Special administration instructions
 */
const medicationSchema = new Schema({
  /**
   * Brand name - commercial name of the prescribed drug.
   * e.g., "Amoxicillin", "Lisinopril", "Metformin"
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
   * Generic name - non-proprietary name of active ingredient.
   * Useful for cross-referencing with medicine database.
   * 
   * @type {string}
   * @trim
   */
  genericName: {
    type: String,
    trim: true
  },
  
  /**
   * Dosage - prescribed amount and measurement unit.
   * e.g., "500mg", "10mg once daily", "1 tablet"
   * 
   * @type {string}
   * @required
   */
  dosage: {
    type: String,
    required: true
  },
  
  /**
   * Frequency - how often medication should be taken.
   * e.g., "twice daily", "every 6 hours", "with meals"
   * 
   * @type {string}
   * @required
   */
  frequency: {
    type: String,
    required: true
  },
  
  /**
   * Duration - length of prescribed treatment.
   * e.g., "7 days", "30 days", "until finished"
   * 
   * @type {string}
   * @required
   */
  duration: {
    type: String,
    required: true
  },
  
  /**
   * Therapeutic category - drug classification.
   * Used for interaction warnings and patient education.
   * 
   * @type {string}
   */
  category: {
    type: String
  },
  
  /**
   * Special instructions - administration guidelines.
   * e.g., "take with food", "avoid alcohol", "store in refrigerator"
   * 
   * @type {string}
   */
  instructions: {
    type: String
  }
});

/**
 * Prescription Mongoose Schema
 * 
 * Defines medical prescription documents issued after appointments.
 * Contains diagnosis, prescribed medications, and follow-up instructions.
 * 
 * @typedef {Object} Prescription
 * @property {ObjectId} appointmentId - Reference to originating appointment (unique)
 * @property {ObjectId} userId - Patient reference
 * @property {string} hospitalName - Prescribing hospital
 * @property {string} department - Medical specialty/department
 * @property {string} doctorName - Prescribing physician
 * @property {Date} appointmentDate - Date of medical consultation
 * @property {string} appointmentTime - Time of consultation
 * @property {string} diagnosis - Medical condition diagnosed
 * @property {Medication[]} medications - Array of prescribed drugs
 * @property {string} instructions - General prescription instructions
 * @property {Date} [followUpDate] - Recommended follow-up appointment date
 * @property {Date} prescribedAt - Prescription issuance timestamp
 * @property {string} status - Current prescription status
 * @property {Date} createdAt - Document creation timestamp
 * @property {Date} updatedAt - Document update timestamp
 */
const prescriptionSchema = new Schema({
  /**
   * Appointment reference - links prescription to medical consultation.
   * Unique constraint ensures one prescription per appointment.
   * 
   * @type {ObjectId}
   * @required
   * @unique
   */
  appointmentId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  
  /**
   * Patient reference - user who received the prescription.
   * 
   * @type {ObjectId}
   * @required
   * @ref User
   * @index
   */
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  /**
   * Hospital name - where prescription was issued.
   * Stored as string (denormalized) for display without population.
   * 
   * @type {string}
   * @required
   * @trim
   */
  hospitalName: {
    type: String,
    required: true,
    trim: true
  },
  
  /**
   * Medical department - specialty area of consultation.
   * e.g., "Cardiology", "Pediatrics", "General Medicine"
   * 
   * @type {string}
   * @required
   * @trim
   */
  department: {
    type: String,
    required: true,
    trim: true
  },
  
  /**
   * Doctor name - prescribing physician.
   * Denormalized for display efficiency.
   * 
   * @type {string}
   * @required
   * @trim
   */
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  
  /**
   * Appointment date - when consultation occurred.
   * 
   * @type {Date}
   * @required
   */
  appointmentDate: {
    type: Date,
    required: true
  },
  
  /**
   * Appointment time - consultation time slot.
   * Stored as string in HH:MM format.
   * 
   * @type {string}
   * @required
   */
  appointmentTime: {
    type: String,
    required: true
  },
  
  /**
   * Medical diagnosis - condition identified during consultation.
   * e.g., "Hypertension Stage 1", "Type 2 Diabetes", "Acute Bronchitis"
   * 
   * @type {string}
   * @required
   */
  diagnosis: {
    type: String,
    required: true
  },
  
  /**
   * Prescribed medications - array of drug prescriptions.
   * Embedded documents for data integrity and performance.
   * 
   * @type {Medication[]}
   */
  medications: [medicationSchema],
  
  /**
   * General instructions - patient guidance beyond medication.
   * e.g., "Rest for 3 days", "Follow up if fever persists", "Maintain hydration"
   * 
   * @type {string}
   * @required
   */
  instructions: {
    type: String,
    required: true
  },
  
  /**
   * Follow-up date - recommended next consultation.
   * Optional based on medical necessity.
   * 
   * @type {Date}
   */
  followUpDate: {
    type: Date
  },
  
  /**
   * Prescription timestamp - when document was created.
   * Auto-generated at creation time.
   * 
   * @type {Date}
   * @default Date.now
   */
  prescribedAt: {
    type: Date,
    default: Date.now
  },
  
  /**
   * Status - current state of prescription lifecycle.
   * 
   * @type {string}
   * @enum ['active', 'completed', 'cancelled']
   * @default 'active'
   */
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  /**
   * Schema options
   * 
   * @property {boolean} timestamps - Automatic createdAt/updatedAt management
   */
  timestamps: true
});

/**
 * Unique index - ensures one prescription per appointment.
 * Prevents duplicate medical records.
 */
prescriptionSchema.index({ appointmentId: 1 }, { unique: true });

/**
 * Compound index - optimizes user prescription history queries.
 * Sorted by prescribed date descending for most-recent-first display.
 */
prescriptionSchema.index({ userId: 1, prescribedAt: -1 });

/**
 * Prescription Model
 * 
 * @constant {mongoose.Model}
 * @name Prescription
 */
module.exports = mongoose.model('Prescription', prescriptionSchema);