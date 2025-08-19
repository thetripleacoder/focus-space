// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const corsOptions = require('./utils/corsConfig');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

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
app.use('/api/blogs', middleware.userExtractor, blogsRouter); // io accessed via registry
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

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
