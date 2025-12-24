const mongoose = require('mongoose');
const User = require('../model/Users');
const AppointmentSlot = require('../model/AppointmentSlot');
const Doctor = require('../model/Doctor');
const Hospital = require('../model/Hospital');

/**
 * Validates appointment data structure and content.
 * 
 * @private
 * @function validateAppointmentData
 * @param {Object} data - Appointment data to validate
 * @param {string} data.hospitalId - Hospital identifier
 * @param {string} data.departmentId - Department identifier
 * @param {string} data.doctorId - Doctor identifier
 * @param {string} data.appointmentDate - Appointment date string
 * @param {string} data.appointmentTime - Appointment time in HH:MM format
 * @returns {Object} Validation result object
 * @returns {boolean} result.valid - Validation status
 * @returns {string} [result.message] - Error message if validation fails
 * @returns {Date} [result.date] - Parsed Date object if validation succeeds
 */
const validateAppointmentData = (data) => {
  const { hospitalId, departmentId, doctorId, appointmentDate, appointmentTime } = data;
  
  if (!hospitalId || !departmentId || !doctorId || !appointmentDate || !appointmentTime) {
    return { valid: false, message: 'All fields are required' };
  }
  
  if (!mongoose.Types.ObjectId.isValid(hospitalId) ||
      !mongoose.Types.ObjectId.isValid(departmentId) ||
      !mongoose.Types.ObjectId.isValid(doctorId)) {
    return { valid: false, message: 'Invalid ID format' };
  }
  
  const date = new Date(appointmentDate);
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Invalid date format' };
  }
  
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(appointmentTime)) {
    return { valid: false, message: 'Invalid time format. Use HH:MM' };
  }
  
  return { valid: true, date };
};

/**
 * Creates a new appointment for the authenticated user.
 * 
 * Validates appointment data, checks slot availability, updates the appointment slot,
 * and creates an appointment record in the user's document.
 * 
 * @async
 * @function addAppointment
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request payload
 * @param {string} req.body.hospitalId - Hospital identifier
 * @param {string} req.body.departmentId - Department identifier
 * @param {string} req.body.doctorId - Doctor identifier
 * @param {string} req.body.appointmentDate - Appointment date
 * @param {string} req.body.appointmentTime - Appointment time (HH:MM)
 * @param {string} req.userId - Authenticated user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with appointment data or error
 * 
 * @example
 * // HTTP POST /api/appointments
 * {
 *   "hospitalId": "60d21b4667d0d8992e610c85",
 *   "departmentId": "60d21b4667d0d8992e610c86",
 *   "doctorId": "60d21b4667d0d8992e610c87",
 *   "appointmentDate": "2024-12-25",
 *   "appointmentTime": "14:30"
 * }
 */
const addAppointment = async (req, res) => {
  try {
    console.log('Appointment request received:', req.body);
    console.log('User ID from token:', req.userId);
    
    const validation = validateAppointmentData(req.body);
    if (!validation.valid) {
      console.log('Validation failed:', validation.message);
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    const { hospitalId, departmentId, doctorId, appointmentDate, appointmentTime } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found:', req.userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const slotDate = new Date(appointmentDate);
    slotDate.setHours(0, 0, 0, 0);
    
    const availableSlot = await AppointmentSlot.findOne({
      doctor: doctorId,
      hospital: hospitalId,
      date: slotDate,
      startTime: appointmentTime,
      isAvailable: true,
      isBooked: false
    });
    
    if (!availableSlot) {
      console.log('No available slot found');
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is no longer available'
      });
    }
    
    const doctor = await Doctor.findById(doctorId).select('name specialty appointmentDuration');
    const hospital = await Hospital.findById(hospitalId).select('name location');
    
    if (!doctor || !hospital) {
      return res.status(400).json({
        success: false,
        message: 'Doctor or hospital not found'
      });
    }
    
    availableSlot.isBooked = true;
    availableSlot.isAvailable = false;
    availableSlot.bookedBy = req.userId;
    await availableSlot.save();
    
    const appointmentEndTime = new Date();
    appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + (doctor.appointmentDuration || 30));
    
    const newAppointment = {
      hospitalId,
      hospitalName: hospital.name,
      departmentId,
      department: doctor.specialty,
      doctorId,
      doctorName: doctor.name,
      appointmentDate: slotDate,
      appointmentTime,
      location: hospital.location,
      status: 'confirmed',
      createdAt: new Date(),
      actualStartTime: new Date(),
      actualEndTime: appointmentEndTime,
      slotId: availableSlot._id
    };
    
    user.appointments.push(newAppointment);
    await user.save();
    
    const savedAppointment = user.appointments[user.appointments.length - 1];
    
    console.log('Appointment booked successfully. Will expire in 1 minute:', savedAppointment._id);
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! It will be completed in 1 minute.',
      appointment: savedAppointment
    });
    
  } catch (err) {
    console.error('Add appointment error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + err.message
    });
  }
};

/**
 * Retrieves paginated appointments for the authenticated user.
 * 
 * Supports filtering by status and date range, with sorting by creation date
 * in descending order.
 * 
 * @async
 * @function getAppointments
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.page=1] - Page number for pagination
 * @param {string} [req.query.limit=10] - Items per page
 * @param {string} [req.query.status] - Filter by appointment status
 * @param {string} [req.query.fromDate] - Start date for date range filter
 * @param {string} [req.query.toDate] - End date for date range filter
 * @param {string} req.userId - Authenticated user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with appointments and pagination metadata
 * 
 * @example
 * // HTTP GET /api/appointments?page=2&limit=5&status=confirmed&fromDate=2024-12-01&toDate=2024-12-31
 */
const getAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, fromDate, toDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const user = await User.findById(req.userId).select('appointments');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    let appointments = [...user.appointments];
    
    if (status) {
      appointments = appointments.filter(apt => apt.status === status);
    }
    
    if (fromDate) {
      const from = new Date(fromDate);
      appointments = appointments.filter(apt => new Date(apt.appointmentDate) >= from);
    }
    
    if (toDate) {
      const to = new Date(toDate);
      appointments = appointments.filter(apt => new Date(apt.appointmentDate) <= to);
    }
    
    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const total = appointments.length;
    const paginatedAppointments = appointments.slice(skip, skip + parseInt(limit));
    
    res.json({
      success: true,
      appointments: paginatedAppointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Cancels a specific appointment for the authenticated user.
 * 
 * Updates the appointment status to 'cancelled' and releases the associated
 * appointment slot for reuse.
 * 
 * @async
 * @function cancelAppointment
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.appointmentId - Appointment identifier to cancel
 * @param {string} req.userId - Authenticated user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with operation result
 * 
 * @example
 * // HTTP DELETE /api/appointments/60d21b4667d0d8992e610c88
 */
const cancelAppointment = async (req, res) => {
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
    
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }
    
    if (appointment.slotId) {
      await AppointmentSlot.findByIdAndUpdate(
        appointment.slotId,
        {
          isBooked: false,
          isAvailable: true,
          bookedBy: null
        }
      );
    }
    
    appointment.status = 'cancelled';
    await user.save();
    
    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Updates specific fields of an existing appointment.
 * 
 * Only allows updates to 'status' and 'notes' fields to maintain data integrity.
 * 
 * @async
 * @function updateAppointment
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.appointmentId - Appointment identifier to update
 * @param {Object} req.body - Update data
 * @param {string} [req.body.status] - New appointment status
 * @param {string} [req.body.notes] - Additional appointment notes
 * @param {string} req.userId - Authenticated user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends HTTP response with updated appointment data
 * 
 * @example
 * // HTTP PATCH /api/appointments/60d21b4667d0d8992e610c88
 * {
 *   "status": "completed",
 *   "notes": "Patient consultation completed"
 * }
 */
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    
    const allowedUpdates = ['status', 'notes'];
    const updates = {};
    
    for (const key in updateData) {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      }
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
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
    
    Object.assign(appointment, updates);
    await user.save();
    
    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (err) {
    console.error('Update appointment error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  addAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointment
};