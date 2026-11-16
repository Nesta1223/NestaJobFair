const mongoose = require('mongoose');
function fail(message, statusCode = 400) { const error = new Error(message); error.statusCode = statusCode; throw error; }
function objectBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) fail('Expected a JSON object');
  return body;
}
function strings(body, fields) {
  objectBody(body);
  for (const field of fields) if (typeof body[field] !== 'string' || !body[field].trim()) fail(`${field} must be a non-empty string`);
}
function objectId(value, label = 'id') {
  if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value) || !mongoose.isValidObjectId(value)) fail(`Invalid ${label}`);
  return value;
}
module.exports = { fail, objectBody, strings, objectId };
