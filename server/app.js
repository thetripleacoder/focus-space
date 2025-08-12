/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

mongoose.set('strictQuery', false);

(async () => {
  try {
    logger.info('🔌 Connecting to', config.MONGODB_URI);
    await mongoose.connect(config.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');
  } catch (error) {
    logger.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
})();

// 🔧 Middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// 📦 API Routes
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// 🧪 Test Routes (only in test env)
if (process.env.NODE_ENV === 'test') {
  const testsRouter = require('./controllers/tests');
  app.use('/api/tests', testsRouter);
}

// 🌐 Optional static serving (uncomment for production)
// app.use(express.static('dist'));

// 🛑 Fallbacks
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
