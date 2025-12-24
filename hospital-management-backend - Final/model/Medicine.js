const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Medicine Mongoose Schema
 * 
 * Defines pharmaceutical product information for prescription management.
 * Contains both brand and generic names, dosage information, and medication details.
 * 
 * @typedef {Object} Medicine
 * @property {string} name - Brand/proprietary name (unique)
 * @property {string} genericName - Scientific/generic name
 * @property {string[]} [dosageForms] - Available administration forms
 * @property {string[]} [strengths] - Available dosage strengths
 * @property {string} [category] - Therapeutic classification
 * @property {string[]} [commonUses] - Typical medical indications
 * @property {string[]} [sideEffects] - Known adverse effects
 * @property {boolean} isActive - Medication availability status
 * @property {Date} createdAt - Document creation timestamp
 * @property {Date} updatedAt - Document update timestamp
 */
const medicineSchema = new Schema({
  /**
   * Brand name - proprietary/trade name of the medication.
   * e.g., "Tylenol", "Lipitor", "Ventolin"
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
   * Generic name - scientific/chemical name of the active ingredient.
   * e.g., "acetaminophen", "atorvastatin", "albuterol"
   * 
   * @type {string}
   * @required
   * @trim
   */
  genericName: {
    type: String,
    required: true,
    trim: true
  },
  
  /**
   * Dosage forms - available physical forms of the medication.
   * Used for prescription accuracy and patient instructions.
   * 
   * @type {string[]}
   * @enum ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment', 'inhaler', 'drops']
   */
  dosageForms: [{
    type: String,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment', 'inhaler', 'drops']
  }],
  
  /**
   * Strengths - available concentration/dosage variants.
   * Format varies by medication (e.g., "500mg", "10mg/mL", "0.1%").
   * 
   * @type {string[]}
   */
  strengths: [String],
  
  /**
   * Therapeutic category - classification by medical use.
   * Helps with drug interaction checks and prescription appropriateness.
   * 
   * @type {string}
   * @enum ['antibiotic', 'analgesic', 'anti-inflammatory', 'antihistamine', 'cardiovascular', 'gastrointestinal', 'respiratory', 'endocrine', 'vitamin', 'other']
   */
  category: {
    type: String,
    enum: ['antibiotic', 'analgesic', 'anti-inflammatory', 'antihistamine', 'cardiovascular', 'gastrointestinal', 'respiratory', 'endocrine', 'vitamin', 'other']
  },
  
  /**
   * Common uses - typical medical conditions treated.
   * e.g., ["pain relief", "fever reduction", "hypertension"]
   * 
   * @type {string[]}
   */
  commonUses: [String],
  
  /**
   * Side effects - known adverse reactions.
   * For patient education and risk assessment.
   * e.g., ["drowsiness", "nausea", "headache"]
   * 
   * @type {string[]}
   */
  sideEffects: [String],
  
  /**
   * Active status - controls medication visibility in prescriptions.
   * Set false for discontinued or recalled medications.
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
   * @property {boolean} timestamps - Auto-managed timestamp fields
   */
  timestamps: true
});

/**
 * Compound index - enables text search on medication names
 * and filtering by therapeutic category.
 * 
 * The text index supports fuzzy search for prescription lookup.
 */
medicineSchema.index({ name: 'text', genericName: 'text', category: 1 });

/**
 * Medicine Model
 * 
 * @constant {mongoose.Model}
 * @name Medicine
 */
module.exports = mongoose.model('Medicine', medicineSchema);