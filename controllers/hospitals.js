const Hospital = require('../models/Hospital');

exports.getHospitals = async (req, res, next) => {
  try {
    const requestQuery = { ...req.query };
    const excludedFields = ['select', 'sort', 'page', 'limit'];
    excludedFields.forEach((field) => delete requestQuery[field]);

    let queryString = JSON.stringify(requestQuery);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    let query = Hospital.find(JSON.parse(queryString)).populate('appointments');

    if (req.query.select) {
      query = query.select(req.query.select.split(',').join(' '));
    }

    query = req.query.sort
      ? query.sort(req.query.sort.split(',').join(' '))
      : query.sort('name');

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 25, 1), 300);
    query = query.skip((page - 1) * limit).limit(limit);

    const data = await query;
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    return next(error);
  }
};

exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('appointments');
    if (!hospital) {
      return res.status(400).json({ success: false, message: 'Hospital not found' });
    }
    return res.status(200).json({ success: true, data: hospital });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid hospital id' });
  }
};

exports.createHospital = async (req, res, next) => {
  try {
    const data = await Hospital.create(req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

exports.updateHospital = async (req, res, next) => {
  try {
    const data = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ success: false, message: 'Hospital not found' });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

exports.deleteHospital = async (req, res, next) => {
  try {
    const data = await Hospital.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Hospital not found' });
    await data.deleteOne();
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    return next(error);
  }
};
