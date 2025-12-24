const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');
const prescriptionController = require('../controllers/prescriptionController');
const verifyJWT = require('../middleware/verifyJWT');

/**
 * User Management Routes
 * 
 * Protected routes for authenticated users to manage their profile,
 * appointments, and prescriptions. All routes require valid JWT.
 */

router.use(verifyJWT);

/**
 * User Profile Management
 */

/**
 * @route GET /api/users/profile
 * @desc Get current user's profile information
 * @access Private
 * 
 * @route PUT /api/users/profile
 * @desc Update user profile details
 * @access Private
 */
router.route('/profile')
  .get(userController.getUserProfile)
  .put(userController.updateUserProfile);

/**
 * Appointment Management
 */

/**
 * @route GET /api/users/appointments
 * @desc Get user's appointments with pagination and filtering
 * @access Private
 * 
 * @route POST /api/users/appointments
 * @desc Create a new appointment
 * @access Private
 */
router.route('/appointments')
  .get(appointmentController.getAppointments)
  .post(appointmentController.addAppointment);

/**
 * @route DELETE /api/users/appointments/:appointmentId
 * @desc Cancel a specific appointment
 * @access Private
 * 
 * @route PUT /api/users/appointments/:appointmentId
 * @desc Update appointment details
 * @access Private
 */
router.route('/appointments/:appointmentId')
  .delete(appointmentController.cancelAppointment)
  .put(appointmentController.updateAppointment);

/**
 * Prescription Management
 */

/**
 * @route GET /api/users/prescriptions
 * @desc Get user's prescription history
 * @access Private
 */
router.route('/prescriptions')
  .get(prescriptionController.getPrescriptions);

/**
 * @route POST /api/users/prescriptions/generate/:appointmentId
 * @desc Generate prescription for completed appointment
 * @access Private
 */
router.post('/prescriptions/generate/:appointmentId', prescriptionController.generatePrescriptionForAppointment);

module.exports = router;