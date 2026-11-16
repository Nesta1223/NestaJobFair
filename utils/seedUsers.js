const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

module.exports = async function seedUsers() {
  const requiredUsers = [
    { name: 'Admin', email: 'admin@gmail.com', password: '12345678', role: 'admin' },
    { name: 'User 8', email: 'user8@gmail.com', password: '12345678', role: 'user' },
  ];

  for (const details of requiredUsers) {
    const existing = await User.findOne({ email: details.email });
    if (!existing) await User.create(details);
  }

  if ((await Hospital.countDocuments()) === 0) {
    const csv = fs.readFileSync(path.join(__dirname, '..', 'data', 'hospitals.csv'), 'utf8');
    const hospitals = parse(csv, { columns: true, skip_empty_lines: true }).map((row) => ({
      name: row.name,
      address: row.address,
      district: row.district,
      province: row.province,
      postalcode: row.postalcode,
      tel: row.tel,
      region: row.region,
    }));

    const latPhrao = hospitals.find((hospital) => hospital.name === 'ลาดพร้าว');
    latPhrao._id = new mongoose.Types.ObjectId('67db8a8c5efd6f2be2be1e5b');
    await Hospital.insertMany(hospitals);
  }

  if ((await Appointment.countDocuments()) === 0) {
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    const latPhrao = await Hospital.findOne({ name: 'ลาดพร้าว' });
    const dates = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06'];
    await Appointment.insertMany(
      dates.map((date) => ({ apptDate: new Date(`${date}T09:00:00.000Z`), user: admin._id, hospital: latPhrao._id })),
    );
  }
};
