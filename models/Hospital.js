const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema(
  {
  name: { type: String, required: true, trim: true },
  address: String,
  district: String,
  province: String,
  postalcode: String,
  tel: String,
    region: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

HospitalSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'hospital',
  justOne: false,
});

HospitalSchema.pre('deleteOne', { document: true, query: false }, async function cascadeDelete() {
  await mongoose.model('Appointment').deleteMany({ hospital: this._id });
});

module.exports = mongoose.model('Hospital', HospitalSchema);
