// index.js
const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const { Server } = require('socket.io');
const corsOptions = require('./utils/corsConfig');
const registerSocketHandlers = require('./utils/socketHandlers');
const { setIO } = require('./utils/socketRegistry');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, { cors: corsOptions });

// Register globally
setIO(io);

// Modular socket event handlers
registerSocketHandlers(io);

// Start server
server.listen(config.PORT, () => {
  logger.info(`✅ Server listening on port ${config.PORT}`);
});

// Optional: graceful error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`❌ Port ${config.PORT} is already in use`);
    process.exit(1);
  } else {
    throw err;
  }
});
