const Prescription = require('../model/Prescription');
const User = require('../model/Users');
const Medicine = require('../model/Medicine');
const mongoose = require('mongoose');

/**
 * Retrieves paginated prescriptions for the authenticated user.
 * 
 * Supports optional date range filtering and returns prescriptions sorted
 * by prescription date in descending order (most recent first).
 * 
 * @async
 * @function getPrescriptions
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.page=1] - Page number for pagination
 * @param {string} [req.query.limit=10] - Items per page
 * @param {string} [req.query.fromDate] - Start date for date range filter (YYYY-MM-DD)
 * @param {string} [req.query.toDate] - End date for date range filter (YYYY-MM-DD)
 * @param {string} req.userId - Authenticated user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with prescriptions and pagination metadata
 * 
 * @example
 * // HTTP GET /api/prescriptions?page=2&limit=5&fromDate=2024-12-01&toDate=2024-12-31
 * 
 * @response {Object} 200 - Prescriptions retrieved successfully
 * @response {boolean} response.success - Operation status
 * @response {Object[]} response.prescriptions - Array of prescription documents
 * @response {Object} response.pagination - Pagination metadata
 * @response {number} response.pagination.page - Current page number
 * @response {number} response.pagination.limit - Items per page
 * @response {number} response.pagination.total - Total number of prescriptions
 * @response {number} response.pagination.pages - Total number of pages
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const getPrescriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, fromDate, toDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = { userId: req.userId };
    
    if (fromDate || toDate) {
      query.prescribedAt = {};
      if (fromDate) query.prescribedAt.$gte = new Date(fromDate);
      if (toDate) query.prescribedAt.$lte = new Date(toDate);
    }
    
    const prescriptions = await Prescription.find(query)
      .sort({ prescribedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Prescription.countDocuments(query);
    
    res.json({
      success: true,
      prescriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get prescriptions error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Generates a random medical diagnosis based on department specialty.
 * 
 * @private
 * @function generateDiagnosis
 * @param {string} department - Medical department/specialty
 * @returns {string} Randomly selected diagnosis appropriate for the department
 */
const generateDiagnosis = (department) => {
  const diagnoses = {
    'Cardiology': ['Hypertension', 'Coronary artery disease', 'Arrhythmia', 'Heart failure', 'Chest pain'],
    'Dermatology': ['Acne vulgaris', 'Eczema', 'Psoriasis', 'Contact dermatitis', 'Skin infection'],
    'Neurology': ['Migraine', 'Tension headache', 'Neuropathy', 'Insomnia', 'Anxiety disorder'],
    'Orthopedics': ['Osteoarthritis', 'Back pain', 'Sprain', 'Tendinitis', 'Fracture follow-up'],
    'Pediatrics': ['Upper respiratory infection', 'Ear infection', 'Viral illness', 'Allergic rhinitis', 'Asthma'],
    'Oncology': ['Follow-up care', 'Symptom management', 'Treatment monitoring', 'Pain management'],
    'Gynecology': ['Menstrual disorder', 'UTI', 'Vaginal infection', 'Contraception management', 'Pregnancy follow-up'],
    'Psychiatry': ['Anxiety disorder', 'Depression', 'Insomnia', 'Stress management', 'Mood disorder'],
    'General': ['General medical condition', 'Follow-up examination', 'Routine checkup', 'Health maintenance']
  };
  
  const deptDiagnoses = diagnoses[department] || diagnoses['General'];
  return deptDiagnoses[Math.floor(Math.random() * deptDiagnoses.length)];
};

/**
 * Generates a medication dosage instruction based on available strengths.
 * 
 * @private
 * @function generateDosage
 * @param {string[]} strengths - Available medication strengths
 * @returns {string} Formatted dosage instruction
 */
const generateDosage = (strengths) => {
  if (!strengths || strengths.length === 0) {
    return 'As directed';
  }
  
  const randomStrength = strengths[Math.floor(Math.random() * strengths.length)];
  const frequencies = ['once daily', 'twice daily', 'three times daily', 'four times daily', 'as needed'];
  const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
  
  return `${randomStrength} ${frequency}`;
};

/**
 * Generates a random medication administration frequency instruction.
 * 
 * @private
 * @function generateFrequency
 * @returns {string} Frequency instruction
 */
const generateFrequency = () => {
  const frequencies = [
    'Take with food',
    'Take on empty stomach',
    'Take with plenty of water',
    'Take at bedtime',
    'Take in the morning',
    'Take with meals'
  ];
  return frequencies[Math.floor(Math.random() * frequencies.length)];
};

/**
 * Generates a random medication duration instruction.
 * 
 * @private
 * @function generateDuration
 * @returns {string} Duration instruction
 */
const generateDuration = () => {
  const durations = ['7 days', '10 days', '14 days', '30 days', 'As needed', 'Until finished', '90 days'];
  return durations[Math.floor(Math.random() * durations.length)];
};

/**
 * Generates category-specific medication instructions.
 * 
 * @private
 * @function generateMedicationInstructions
 * @param {string} category - Medication category
 * @returns {string} Category-appropriate medication instructions
 */
const generateMedicationInstructions = (category) => {
  const instructions = {
    'antibiotic': 'Complete the full course even if you feel better',
    'analgesic': 'Take with food if stomach upset occurs',
    'anti-inflammatory': 'Take with food or milk to avoid stomach irritation',
    'antihistamine': 'May cause drowsiness - avoid driving',
    'cardiovascular': 'Take at the same time every day',
    'gastrointestinal': 'Take 30-60 minutes before meals',
    'respiratory': 'Rinse mouth after using inhaler',
    'endocrine': 'Take with food to reduce stomach upset',
    'vitamin': 'Take with food for better absorption'
  };
  
  return instructions[category] || 'Take as directed by your physician';
};

/**
 * Generates random general prescription instructions.
 * 
 * @private
 * @function generateInstructions
 * @returns {string} General prescription instructions
 */
const generateInstructions = () => {
  const instructions = [
    'Complete the full course of medication',
    'Return if symptoms worsen',
    'Avoid alcohol while taking this medication',
    'May cause drowsiness - avoid driving',
    'Take with plenty of water',
    'Store at room temperature away from moisture',
    'Follow up if no improvement in 3 days',
    'Maintain adequate hydration',
    'Avoid prolonged sun exposure'
  ];
  return instructions[Math.floor(Math.random() * instructions.length)];
};

/**
 * Generates a random follow-up date between 7-90 days in the future.
 * 
 * @private
 * @function generateFollowUpDate
 * @returns {Date} Future follow-up date
 */
const generateFollowUpDate = () => {
  const followUpDays = [7, 14, 30, 60, 90];
  const days = followUpDays[Math.floor(Math.random() * followUpDays.length)];
  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + days);
  return followUpDate;
};

/**
 * Generates a prescription for a completed appointment.
 * 
 * Creates a prescription document with randomized medical data based on the
 * appointment details. Updates the appointment status to 'completed' and
 * attaches the prescription reference.
 * 
 * @async
 * @function generatePrescriptionForAppointment
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.appointmentId - Appointment identifier
 * @param {string} req.userId - Authenticated user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with generated prescription or error
 * 
 * @example
 * // HTTP POST /api/appointments/60d21b4667d0d8992e610c88/prescription
 * 
 * @response {Object} 200 - Prescription generated successfully
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Success message
 * @response {Object} response.prescription - Generated prescription document
 * 
 * @response {Object} 400 - Invalid parameters or constraints
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 404 - User or appointment not found
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 500 - Internal server error or database issue
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const generatePrescriptionForAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const appointment = user.appointments.id(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Prescription can only be generated for confirmed or completed appointments'
      });
    }
    
    const existingPrescription = await Prescription.findOne({ appointmentId: appointmentId });
    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message: 'Prescription already exists for this appointment'
      });
    }
    
    const medicineCount = Math.floor(Math.random() * 3) + 1;
    const allMedicines = await Medicine.find({ isActive: true });
    
    if (allMedicines.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'No medicines available in database'
      });
    }
    
    const shuffledMedicines = [...allMedicines].sort(() => 0.5 - Math.random());
    const selectedMedicines = shuffledMedicines.slice(0, medicineCount);
    
    const medications = selectedMedicines.map(med => ({
      name: med.name,
      genericName: med.genericName,
      dosage: generateDosage(med.strengths),
      frequency: generateFrequency(),
      duration: generateDuration(),
      category: med.category,
      instructions: generateMedicationInstructions(med.category)
    }));
    
    const prescriptionData = {
      appointmentId: appointmentId,
      userId: req.userId,
      hospitalName: appointment.hospitalName,
      department: appointment.department,
      doctorName: appointment.doctorName,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      diagnosis: generateDiagnosis(appointment.department),
      medications: medications,
      instructions: generateInstructions(),
      followUpDate: generateFollowUpDate(),
      prescribedAt: new Date(),
      status: 'active'
    };
    
    const prescription = new Prescription(prescriptionData);
    await prescription.save();
    
    appointment.prescriptionId = prescription._id;
    appointment.status = 'completed';
    await user.save();
    
    res.json({
      success: true,
      message: 'Prescription generated successfully',
      prescription
    });
    
  } catch (error) {
    console.error('Error generating prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getPrescriptions,
  generatePrescriptionForAppointment
};