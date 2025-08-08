// Import express and create router
const express = require('express');
const router = express.Router();

// Import controller functions for appointments
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

// Import authentication middleware to protect routes
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// Appointment Routes
// All routes are protected to ensure only logged-in users can access them
// ==========================================

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (protected)
// 
// @route   GET /api/appointments
// @desc    Get all appointments for the logged-in user
// @access  Private (protected)
router
  .route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

// @route   PUT /api/appointments/:id
// @desc    Update an existing appointment
// @access  Private (protected)
//
// @route   DELETE /api/appointments/:id
// @desc    Delete an existing appointment
// @access  Private (protected)
router
  .route('/:id')
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

// Export the router for use in your main server file
module.exports = router;
