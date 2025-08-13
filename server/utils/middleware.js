const User = require('../models/user');
const logger = require('./logger');
const jwt = require('jsonwebtoken');

// Allowed fields for Blog creation/update
const allowedBlogFields = [
  'title',
  'likes',
  'user',
  'genres',
  'comments',
  'likedBy',
  'createdAt',
];

// --- Logging ---
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

// --- Unknown Endpoint ---
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// --- Error Handler ---
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' });
  }

  next(error);
};

// --- Token Extractor ---
const tokenExtractor = (request, response, next) => {
  request.token = '';
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }
  next();
};

// --- User Extractor ---
const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  const user = await User.findById(decodedToken.id);
  request.user = user;
  next();
};

// --- Blog Payload Sanitizer ---
const sanitizeBlogPayload = (payload = {}) => {
  const sanitized = {};
  for (const key of allowedBlogFields) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const value = payload[key];
      if (value !== undefined) {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
};

// --- Blog Payload Validator ---
const validateBlogFields = (body) => {
  const invalidKeys = Object.keys(body).filter(
    (key) => !allowedBlogFields.includes(key)
  );
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid fields: ${invalidKeys.join(', ')}`);
  }
};

// --- Combined Middleware ---
const sanitizeAndValidateBlog = (req, res, next) => {
  try {
    validateBlogFields(req.body);
    req.sanitizedBody = sanitizeBlogPayload(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  sanitizeAndValidateBlog,
};
