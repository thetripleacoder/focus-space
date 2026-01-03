// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const rateLimit = require('express-rate-limit'); // COMMENTED OUT

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const corsOptions = require('./utils/corsConfig');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

// Rate limiting for auth endpoints - COMMENTED OUT
/*
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: {
      type: 'RATE_LIMIT_ERROR',
      message:
        'Too many login attempts. Please wait 15 minutes before trying again.',
      retryAfter: '15 minutes',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration attempts per hour
  message: {
    error: {
      type: 'RATE_LIMIT_ERROR',
      message:
        'Too many registration attempts. Please wait 1 hour before trying again.',
      retryAfter: '1 hour',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
*/

const app = express();

// 🔌 MongoDB connection
mongoose.set('strictQuery', false);
(async () => {
  try {
    logger.info('🔌 Connecting to', config.MONGODB_URI);
    await mongoose.connect(config.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
})();

// 🔧 Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// 📦 Routes
app.use('/api/blogs', blogsRouter); // Public blog routes (auth handled per route)
// app.use('/api/users', registerLimiter, usersRouter); // Apply registration rate limiting - COMMENTED OUT
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter); // Apply login rate limiting - COMMENTED OUT

// 🧪 Test routes
if (process.env.NODE_ENV === 'test') {
  const testsRouter = require('./controllers/tests');
  app.use('/api/tests', testsRouter);
}

// 🌐 Optional static serving
// app.use(express.static('dist'));

// 🛑 Fallbacks
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
