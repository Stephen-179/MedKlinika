// backend/models/patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {type: String, required: true},
    gender: {type: String, enum: ['male', 'female', 'other'], required: true},
    dateOfBirth: {type: Date},
    phone: {type: String},
    address: {type: String},
    allergies: {type: String},
    medicalHistory: {type: String},
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;