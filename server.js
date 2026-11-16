const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, 'config/config.env'), quiet: true });
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const app = express();
app.disable('x-powered-by');
app.set('query parser', 'extended');
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.get('/health', (req, res) => res.json({ success: true, service: 'nesta-job-fair' }));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/companies', require('./routes/companies'));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(require('./middleware/error'));
async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Set JWT_SECRET to a random value of at least 32 characters');
  await connectDB();
  await Promise.all([require('./models/User').init(), require('./models/Company').init()]);
  return app.listen(process.env.PORT || 5000, () => console.log(`Nesta API on port ${process.env.PORT || 5000}`));
}
if (require.main === module) start().catch((error) => { console.error(error.message); process.exitCode = 1; });
module.exports = { app, start };
