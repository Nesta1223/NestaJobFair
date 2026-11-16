const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

exports.getAppointments = async (req, res, next) => {
  try {
    const filter = req.params.hospitalId ? { hospital: req.params.hospitalId } : {};
    if (req.user.role !== 'admin') filter.user = req.user.id;

    const data = await Appointment.find(filter)
      .populate({ path: 'hospital', select: 'name province tel' })
      .sort('apptDate');

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    return next(error);
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: 'hospital',
      select: 'name province tel',
    });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return next(error);
  }
};

exports.addAppointment = async (req, res, next) => {
  try {
    req.body.hospital = req.params.hospitalId;
    req.body.user = req.user.id;

    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    if (req.user.role !== 'admin') {
      const count = await Appointment.countDocuments({ user: req.user.id });
      if (count >= 3) {
        return res.status(400).json({
          success: false,
          message: 'A user can have at most 3 appointments',
        });
      }
    }

    const appointment = await Appointment.create(req.body);
    return res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    return next(error);
  }
};

async function findOwnedAppointment(req, res) {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404).json({ success: false, message: 'Appointment not found' });
    return null;
  }
  if (req.user.role !== 'admin' && appointment.user.toString() !== req.user.id.toString()) {
    res.status(401).json({ success: false, message: 'Not authorized to modify this appointment' });
    return null;
  }
  return appointment;
}

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await findOwnedAppointment(req, res);
    if (!appointment) return undefined;
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return next(error);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await findOwnedAppointment(req, res);
    if (!appointment) return undefined;
    await appointment.deleteOne();
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    return next(error);
  }
};
