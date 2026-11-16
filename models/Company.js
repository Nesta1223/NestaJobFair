const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  website: { type: String, required: true, trim: true, validate: {
    validator(value) { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } },
    message: 'website must be an HTTP or HTTPS URL',
  } },
  description: { type: String, required: true, trim: true },
  tel: { type: String, required: true, trim: true, match: /^\+?[0-9][0-9 ()-]{5,19}$/ },
}, { timestamps: true });
module.exports = mongoose.model('Company', CompanySchema);
