const Hospital = require('../model/Hospital');
const Department = require('../model/Department');
const Doctor = require('../model/Doctor');
const AppointmentSlot = require('../model/AppointmentSlot');
const mongoose = require('mongoose');

/**
 * Retrieves all distinct hospital locations from the database.
 * 
 * Returns a list of unique location strings where hospitals are situated,
 * filtering out any empty or whitespace-only values.
 * 
 * @async
 * @function getLocations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with locations array and count
 * 
 * @example
 * // HTTP GET /api/hospitals/locations
 * 
 * @response {Object} 200 - Locations retrieved successfully
 * @response {boolean} response.success - Operation status
 * @response {string[]} response.locations - Array of unique location strings
 * @response {number} response.count - Number of locations returned
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const getLocations = async (req, res) => {
  try {
    const locations = await Hospital.distinct('location');
    
    res.json({
      success: true,
      locations: locations.filter(loc => loc && loc.trim() !== ''),
      count: locations.length
    });
  } catch (err) {
    console.error('Get locations error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Retrieves hospitals filtered by location.
 * 
 * Performs a case-insensitive search for hospitals in the specified location,
 * returning only active hospitals with selected fields.
 * 
 * @async
 * @function getHospitalsByLocation
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.location - Location to search for
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with hospitals array and count
 * 
 * @example
 * // HTTP GET /api/hospitals/location/New%20York
 * 
 * @response {Object} 200 - Hospitals retrieved successfully
 * @response {boolean} response.success - Operation status
 * @response {Object[]} response.hospitals - Array of hospital objects
 * @response {string} response.hospitals[].name - Hospital name
 * @response {string} response.hospitals[].location - Hospital location
 * @response {string} response.hospitals[].address - Hospital address
 * @response {string} response.hospitals[].phone - Hospital phone number
 * @response {string} response.hospitals[].email - Hospital email address
 * @response {number} response.count - Number of hospitals returned
 * 
 * @response {Object} 400 - Invalid location parameter
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const getHospitalsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    
    if (!location || location.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }
    
    const hospitals = await Hospital.find({ 
      location: new RegExp(location, 'i'),
      isActive: true 
    })
    .select('name location address phone email')
    .lean();
    
    res.json({
      success: true,
      hospitals,
      count: hospitals.length
    });
  } catch (err) {
    console.error('Get hospitals error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Retrieves all active departments from the database.
 * 
 * Returns department information sorted alphabetically by name.
 * 
 * @async
 * @function getDepartments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with departments array and count
 * 
 * @example
 * // HTTP GET /api/departments
 * 
 * @response {Object} 200 - Departments retrieved successfully
 * @response {boolean} response.success - Operation status
 * @response {Object[]} response.departments - Array of department objects
 * @response {string} response.departments[].name - Department name
 * @response {string} response.departments[].description - Department description
 * @response {number} response.count - Number of departments returned
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const getDepartments = async (req, res) => {
  try {
    const departments = await Department
      .find({ isActive: true })
      .select('name description')
      .sort('name')
      .lean();
    
    res.json({
      success: true,
      departments,
      count: departments.length
    });
  } catch (err) {
    console.error('Get departments error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Retrieves doctors by department and hospital.
 * 
 * Returns active doctors working in a specific department at a specific hospital,
 * including populated department information.
 * 
 * @async
 * @function getDoctorsByDepartmentAndHospital
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.departmentId - Department identifier
 * @param {string} req.params.hospitalId - Hospital identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with doctors array and count
 * 
 * @example
 * // HTTP GET /api/hospitals/60d21b4667d0d8992e610c85/departments/60d21b4667d0d8992e610c86/doctors
 * 
 * @response {Object} 200 - Doctors retrieved successfully
 * @response {boolean} response.success - Operation status
 * @response {Object[]} response.doctors - Array of doctor objects
 * @response {string} response.doctors[].name - Doctor name
 * @response {string} response.doctors[].specialty - Doctor specialty
 * @response {number} response.doctors[].consultationFee - Consultation fee
 * @response {number} response.doctors[].experience - Years of experience
 * @response {string[]} response.doctors[].qualifications - Doctor qualifications
 * @response {string} response.doctors[].email - Doctor email
 * @response {string} response.doctors[].phone - Doctor phone
 * @response {number} response.doctors[].appointmentDuration - Appointment duration in minutes
 * @response {Object} response.doctors[].department - Department information
 * @response {string} response.doctors[].department.name - Department name
 * @response {number} response.count - Number of doctors returned
 * 
 * @response {Object} 400 - Invalid department or hospital ID
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const getDoctorsByDepartmentAndHospital = async (req, res) => {
  try {
    const { departmentId, hospitalId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(departmentId) || 
        !mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department or hospital ID'
      });
    }
    
    const doctors = await Doctor.find({
      department: departmentId,
      hospital: hospitalId,
      isActive: true
    })
    .select('name specialty consultationFee experience qualifications email phone appointmentDuration')
    .populate('department', 'name')
    .lean();
    
    res.json({
      success: true,
      doctors,
      count: doctors.length
    });
  } catch (err) {
    console.error('Get doctors error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Retrieves available appointment slots for a specific doctor, hospital, and date.
 * 
 * Returns time slots that are both available and not booked for the specified date.
 * Uses the doctor's appointment duration for slots without explicit duration values.
 * 
 * @async
 * @function getAvailableSlots
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.doctorId - Doctor identifier
 * @param {string} req.params.hospitalId - Hospital identifier
 * @param {string} req.params.date - Appointment date (YYYY-MM-DD format)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with available slots array and count
 * 
 * @example
 * // HTTP GET /api/doctors/60d21b4667d0d8992e610c87/hospitals/60d21b4667d0d89923444c85/available-slots/2024-12-29
 * 
 * @response {Object} 200 - Slots retrieved successfully
 * @response {boolean} response.success - Operation status
 * @response {Object[]} response.availableSlots - Array of appointment slot objects
 * @response {string} response.availableSlots[].startTime - Slot start time (HH:MM)
 * @response {string} response.availableSlots[].endTime - Slot end time (HH:MM)
 * @response {number} response.availableSlots[].duration - Slot duration in minutes
 * @response {boolean} response.availableSlots[].isAvailable - Slot availability status
 * @response {boolean} response.availableSlots[].isBooked - Slot booking status
 * @response {number} response.count - Number of available slots
 * 
 * @response {Object} 400 - Invalid parameters
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 * 
 * @response {Object} 500 - Internal server error
 * @response {boolean} response.success - Operation status
 * @response {string} response.message - Error description
 */
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, hospitalId, date } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(doctorId) || 
        !mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor or hospital ID'
      });
    }
    
    const slotDate = new Date(date);
    if (isNaN(slotDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }
    
    slotDate.setHours(0, 0, 0, 0);
    
    const startOfDay = new Date(slotDate);
    const endOfDay = new Date(slotDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const slots = await AppointmentSlot.find({
      doctor: doctorId,
      hospital: hospitalId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      isAvailable: true,
      isBooked: false
    })
    .select('startTime endTime duration isAvailable isBooked')
    .sort({ startTime: 1 })
    .lean();
    
    const doctor = await Doctor.findById(doctorId)
      .select('appointmentDuration')
      .lean();

    const defaultDuration = doctor?.appointmentDuration || 30;
    
    const formattedSlots = slots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration || defaultDuration,
      isAvailable: slot.isAvailable,
      isBooked: slot.isBooked
    }));
    
    res.json({
      success: true,
      availableSlots: formattedSlots,
      count: formattedSlots.length
    });
  } catch (err) {
    console.error('Get available slots error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getLocations,
  getHospitalsByLocation,
  getDepartments,
  getDoctorsByDepartmentAndHospital,
  getAvailableSlots
};