/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const createBlogsRouter = require('./controllers/blogs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for your frontend origin
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('blogCreated', (blog) => {
    socket.broadcast.emit('blogCreated', blog);
  });

  socket.on('blogUpdated', (blog) => {
    socket.broadcast.emit('blogUpdated', blog);
  });

  socket.on('blogDeleted', (id) => {
    socket.broadcast.emit('blogDeleted', id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});

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
app.use('/api/blogs', middleware.userExtractor, createBlogsRouter(io));
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
