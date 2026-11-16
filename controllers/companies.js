const Company = require('../models/Company');
const { objectId, fail } = require('../utils/validation');
exports.getCompanies = async (req, res) => {
  const data = await Company.find().sort({ name: 1 });
  return res.json({ success: true, count: data.length, data });
};
exports.getCompany = async (req, res) => {
  const data = await Company.findById(objectId(req.params.id));
  if (!data) fail('Company not found', 404);
  return res.json({ success: true, data });
};
