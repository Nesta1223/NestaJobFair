module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  let status = err.statusCode || err.status || 500;
  let message = err.message;
  if (err.name === 'ValidationError' || err.name === 'CastError') status = 400;
  if (err.code === 11000) { status = 400; message = 'Duplicate value'; }
  if (status >= 500) { console.error(err.name, err.message); message = 'Server error'; }
  return res.status(status).json({ success: false, message });
};
