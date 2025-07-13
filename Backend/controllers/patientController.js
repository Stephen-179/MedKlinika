// backend/controllers/patientController.js
const Patient = require('../models/Patient');

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res) => {
  const { name, gender, dateOfBirth, phone, address, allergies, medicalHistory } = req.body;

  try {
    const patient = new Patient({
      name,
      gender,
      dateOfBirth,
      phone,
      address,
      allergies,
      medicalHistory,
      createdBy: req.user._id,
    });

    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ createdBy: req.user._id });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient && patient.createdBy.toString() === req.user._id.toString()) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  const { name, gender, dateOfBirth, phone, address, allergies, medicalHistory } = req.body;

  try {
    const patient = await Patient.findById(req.params.id);

    if (patient && patient.createdBy.toString() === req.user._id.toString()) {
      patient.name = name || patient.name;
      patient.gender = gender || patient.gender;
      patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
      patient.phone = phone || patient.phone;
      patient.address = address || patient.address;
      patient.allergies = allergies || patient.allergies;
      patient.medicalHistory = medicalHistory || patient.medicalHistory;

      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient && patient.createdBy.toString() === req.user._id.toString()) {
      await patient.remove();
      res.json({ message: 'Patient removed' });
    } else {
      res.status(404).json({ message: 'Patient not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
