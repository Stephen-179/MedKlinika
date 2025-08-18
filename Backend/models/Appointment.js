const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  date: { type: Date, required: true },  // store as Date
  time: { type: String, required: true }, // store separately
  reason: { type: String, default: 'Routine checkup' },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
