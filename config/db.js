const mongoose = require('mongoose');
module.exports = async function connectDB() {
  return mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nesta_job_fair', { serverSelectionTimeoutMS: 10000 });
};
