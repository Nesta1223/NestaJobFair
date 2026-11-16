const User = require('../models/User');
const { strings } = require('../utils/validation');
function cookieOptions() { return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' }; }
function sendTokenResponse(user, statusCode, res) {
  const token = user.getSignedJwtToken();
  return res.status(statusCode).cookie('token', token, {
    ...cookieOptions(), expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE || 1) * 86400000),
  }).json({ success: true, token, data: { _id: user.id, name: user.name, tel: user.tel, email: user.email, role: user.role } });
}
exports.register = async (req, res) => {
  strings(req.body, ['name', 'tel', 'email', 'password']);
  const { name, tel, email, password } = req.body;
  const user = await User.create({ name, tel, email, password, role: 'user' });
  return sendTokenResponse(user, 201, res);
};
exports.login = async (req, res) => {
  strings(req.body, ['email', 'password']);
  const user = await User.findOne({ email: req.body.email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  return sendTokenResponse(user, 200, res);
};
exports.getMe = (req, res) => res.json({ success: true, data: req.user });
exports.logout = (req, res) => res.cookie('token', 'none', {
  ...cookieOptions(), expires: new Date(Date.now() + 10000),
}).json({ success: true, data: {} });
// Chapter12: client must also discard Bearer token. This is cookie logout, not JWT revocation.
