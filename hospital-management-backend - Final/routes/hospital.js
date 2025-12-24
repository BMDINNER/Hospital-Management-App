const express = require('express');
const router = express.Router();

const {
  getLocations,
  getHospitalsByLocation,
  getDepartments,
  getDoctorsByDepartmentAndHospital,
  getAvailableSlots
} = require('../controllers/hospitalController');

/**
 * Hospital & Resource Discovery Routes
 * 
 * Public routes for browsing hospitals, departments, doctors, and availability.
 * These endpoints support the appointment booking workflow.
 */

/**
 * @route GET /api/hospitals/locations
 * @desc Get all distinct hospital locations
 * @access Public
 */
router.get('/locations', getLocations);

/**
 * @route GET /api/hospitals/hospitals/:location
 * @desc Get hospitals filtered by location
 * @access Public
 */
router.get('/hospitals/:location', getHospitalsByLocation);

/**
 * @route GET /api/hospitals/departments
 * @desc Get all active medical departments
 * @access Public
 */
router.get('/departments', getDepartments);

/**
 * @route GET /api/hospitals/doctors/:departmentId/:hospitalId
 * @desc Get doctors by department and hospital
 * @access Public
 */
router.get('/doctors/:departmentId/:hospitalId', getDoctorsByDepartmentAndHospital);

/**
 * @route GET /api/hospitals/slots/:doctorId/:hospitalId/:date
 * @desc Get available appointment slots for specific criteria
 * @access Public
 */
router.get('/slots/:doctorId/:hospitalId/:date', getAvailableSlots);

module.exports = router;