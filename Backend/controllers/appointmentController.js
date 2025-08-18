const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// GET appointments with pagination + search
exports.getAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { reason: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate('patient', 'name gender')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: 1 });

    res.json({
      data: appointments,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// ADD appointment
exports.addAppointment = async (req, res) => {
  try {
    const { patient, date, time, reason, status } = req.body;

    if (!patient || !date || !time) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // ensure patient exists
    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointment = await Appointment.create({
      patient,
      date,
      time,
      reason,
      status,
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add appointment' });
  }
};

// DELETE appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete appointment' });
  }
};

// UPDATE appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient, date, time, reason, status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { patient, date, time, reason, status },
      { new: true }
    ).populate('patient', 'name gender');

    if (!updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};
