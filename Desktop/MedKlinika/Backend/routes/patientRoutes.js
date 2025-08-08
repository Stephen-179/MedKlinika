// backend/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createPatient)
  .get(protect, getPatients);

router.route('/:id')
  .get(protect, getPatientById)
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

module.exports = router;
