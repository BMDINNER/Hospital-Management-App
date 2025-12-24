const User = require('../model/Users');
const Prescription = require('../model/Prescription');
const Medicine = require('../model/Medicine');

/**
 * Generate random diagnosis based on medical department.
 * 
 * @private
 * @function generateDiagnosis
 * @param {string} department - Medical department/specialty
 * @returns {string} Randomly selected appropriate diagnosis
 * 
 * @note Uses predefined diagnosis lists per department
 * @todo Consider moving to a more sophisticated medical knowledge base
 */
const generateDiagnosis = (department) => {
  const diagnoses = {
    'Cardiology': ['Hypertension', 'Coronary artery disease', 'Arrhythmia', 'Heart failure', 'Chest pain'],
    'Dermatology': ['Acne vulgaris', 'Eczema', 'Psoriasis', 'Contact dermatitis', 'Skin infection'],
    'Neurology': ['Migraine', 'Tension headache', 'Neurophy', 'Insomnia', 'Anxiety disorder'],
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
 * Generate medication dosage instruction based on available strengths.
 * 
 * @private
 * @function generateDosage
 * @param {string[]} strengths - Available medication strength options
 * @returns {string} Formatted dosage instruction
 * 
 * @note Combines random strength with random frequency
 * @warning In production, this should follow proper dosing guidelines
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
 * Generate category-specific medication instructions.
 * 
 * @private
 * @function generateMedicationInstructions
 * @param {string} category - Medication therapeutic category
 * @returns {string} Appropriate administration instructions
 * 
 * @note Provides safety and efficacy guidance per medication type
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
 * Generate a prescription for a completed appointment.
 * 
 * Creates prescription document with random but appropriate medications
 * based on appointment details and available medicines database.
 * 
 * @async
 * @function generatePrescription
 * @param {Object} appointment - Appointment document
 * @param {string} userId - Patient identifier
 * @returns {Promise<Prescription>} Created prescription document
 * @throws {Error} If no medicines available or database error
 * 
 * @note Uses random selection from medicine database
 * @warning For demo purposes only - real prescriptions require medical expertise
 */
const generatePrescription = async (appointment, userId) => {
  try {
    const existingPrescription = await Prescription.findOne({ appointmentId: appointment._id });
    if (existingPrescription) {
      return existingPrescription;
    }

    const medicineCount = Math.floor(Math.random() * 3) + 1; // 1-3 medications
    const allMedicines = await Medicine.find({ isActive: true });
    
    if (allMedicines.length === 0) {
      throw new Error('No medicines available in database');
    }
    
    const shuffledMedicines = [...allMedicines].sort(() => 0.5 - Math.random());
    const selectedMedicines = shuffledMedicines.slice(0, medicineCount);
    
    const medications = selectedMedicines.map(med => ({
      name: med.name,
      genericName: med.genericName,
      dosage: generateDosage(med.strengths),
      frequency: 'As prescribed',
      duration: '7 days',
      category: med.category,
      instructions: generateMedicationInstructions(med.category)
    }));
    
    const prescriptionData = {
      appointmentId: appointment._id,
      userId: userId,
      hospitalName: appointment.hospitalName,
      department: appointment.department,
      doctorName: appointment.doctorName,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      diagnosis: generateDiagnosis(appointment.department),
      medications: medications,
      instructions: 'Complete the course and follow up if symptoms persist',
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      prescribedAt: new Date(),
      status: 'active'
    };
    
    const prescription = new Prescription(prescriptionData);
    await prescription.save();
    
    return prescription;
  } catch (error) {
    console.error('Error generating prescription:', error);
    throw error;
  }
};

/**
 * Expire confirmed appointments and generate prescriptions.
 * 
 * Background service that processes confirmed appointments, marks them as completed,
 * and generates prescription documents. Used for simulating appointment completion.
 * 
 * @async
 * @function expireAppointments
 * @returns {Promise<number>} Number of appointments expired
 * @throws {Error} If database operations fail
 * 
 * @note This simulates real-world appointment lifecycle
 * @warning Currently expires ALL confirmed appointments regardless of time
 * @todo Add time-based expiration logic based on appointment date/time
 */
const expireAppointments = async () => {
  try {
    console.log('Checking for appointments to expire...');
    
    // Find ALL confirmed appointments (regardless of date)
    // TODO: Add date-based filtering to expire only past appointments
    const users = await User.find({
      'appointments.status': 'confirmed'
    });
    
    let expiredCount = 0;
    
    for (const user of users) {
      let shouldSave = false;
      
      for (const appointment of user.appointments) {
        if (appointment.status === 'confirmed') {
          
          console.log(`Expiring appointment ${appointment._id} for user ${user._id}`);
          console.log(`Appointment was scheduled for: ${appointment.appointmentDate} at ${appointment.appointmentTime}`);
          
          // Update appointment status to completed
          appointment.status = 'completed';
          
          // Generate prescription (may fail if medicine DB empty)
          try {
            const prescription = await generatePrescription(appointment, user._id);
            appointment.prescriptionId = prescription._id;
            console.log(`Generated prescription ${prescription._id} for appointment ${appointment._id}`);
          } catch (error) {
            console.error(`Failed to generate prescription for appointment ${appointment._id}:`, error);
            // Continue even if prescription generation fails
          }
          
          shouldSave = true;
          expiredCount++;
        }
      }
      
      if (shouldSave) {
        await user.save();
        console.log(`Saved user ${user._id} with updated appointments`);
      }
    }
    
    console.log(`Expired ${expiredCount} appointments`);
    return expiredCount;
  } catch (error) {
    console.error('Error in expireAppointments:', error);
    throw error;
  }
};

module.exports = {
  expireAppointments,
  generatePrescription
};