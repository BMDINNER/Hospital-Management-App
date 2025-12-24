const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Hospital Mongoose Schema
 * 
 * Defines healthcare facility entities within the system.
 * Hospitals serve as primary locations where medical services are provided.
 * 
 * @typedef {Object} Hospital
 * @property {string} name - Hospital name/identifier
 * @property {string} location - Geographic location/city
 * @property {Object} [address] - Detailed address information
 * @property {string} [address.street] - Street address
 * @property {string} [address.city] - City name
 * @property {string} [address.state] - State/province
 * @property {string} [address.zipCode] - Postal/ZIP code
 * @property {string} [phone] - Contact telephone
 * @property {string} [email] - Contact email
 * @property {ObjectId[]} [departments] - Array of department references
 * @property {boolean} isActive - Facility status flag
 * @property {Date} createdAt - Document creation timestamp
 * @property {Date} updatedAt - Document update timestamp
 */
const hospitalSchema = new Schema({
  /**
   * Hospital name - primary identifier for the healthcare facility.
   * e.g., "City General Hospital", "Northwest Medical Center"
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
   * Location - city or region where hospital is situated.
   * Used for geographic filtering and patient search.
   * 
   * @type {string}
   * @required
   * @trim
   */
  location: {
    type: String,
    required: true,
    trim: true
  },
  
  /**
   * Address - structured location details for maps and navigation.
   * Optional but recommended for complete facility information.
   * 
   * @type {Object}
   */
  address: {
    /**
     * Street - building number and street name.
     * @type {string}
     */
    street: String,
    
    /**
     * City - municipality name.
     * Often duplicates location field but provides structured data.
     * @type {string}
     */
    city: String,
    
    /**
     * State - province or state name.
     * @type {string}
     */
    state: String,
    
    /**
     * ZIP code - postal code for the area.
     * @type {string}
     */
    zipCode: String
  },
  
  /**
   * Phone number - main contact telephone.
   * Format not validated to accommodate international numbers.
   * 
   * @type {string}
   */
  phone: String,
  
  /**
   * Email - general contact or administration email.
   * 
   * @type {string}
   */
  email: String,
  
  /**
   * Department references - medical specialties available at this hospital.
   * Populated with Department model IDs for relationship management.
   * 
   * @type {ObjectId[]}
   * @ref Department
   */
  departments: [{
    type: Schema.Types.ObjectId,
    ref: 'Department'
  }],
  
  /**
   * Active status - controls hospital visibility in listings.
   * Set false for temporarily closed or decommissioned facilities.
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
   * @property {boolean} timestamps - Automatic timestamp management
   */
  timestamps: true
});

/**
 * Compound index - optimizes location-based queries with active status filtering.
 * Used in hospital search functionality.
 */
hospitalSchema.index({ location: 1, isActive: 1 });

/**
 * Hospital Model
 * 
 * @constant {mongoose.Model}
 * @name Hospital
 */
module.exports = mongoose.model('Hospital', hospitalSchema);