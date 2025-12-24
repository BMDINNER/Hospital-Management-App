const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const verifyJWT = require('../middleware/verifyJWT');

/**
 * Appointment Management Routes
 * 
 * All routes in this module require JWT authentication.
 * Routes handle the full appointment lifecycle: creation, retrieval,
 * modification, and cancellation.
 */

router.use(verifyJWT);

/**
 * @route POST /api/appointments
 * @desc Create a new appointment
 * @access Private
 */
router.post('/', appointmentController.addAppointment);

/**
 * @route GET /api/appointments
 * @desc Get user's appointments with optional filtering
 * @access Private
 */
router.get('/', appointmentController.getAppointments);

/**
 * @route DELETE /api/appointments/:appointmentId
 * @desc Cancel a specific appointment
 * @access Private
 */
router.delete('/:appointmentId', appointmentController.cancelAppointment);

/**
 * @route PUT /api/appointments/:appointmentId
 * @desc Update appointment details (status, notes)
 * @access Private
 */
router.put('/:appointmentId', appointmentController.updateAppointment);

module.exports = router;