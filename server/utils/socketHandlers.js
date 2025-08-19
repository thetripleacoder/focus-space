// utils/socketHandlers.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ Client connected:', socket.id);

    // Optional: Attach metadata if using auth
    // socket.userId = decodeToken(socket.handshake.auth.token);

    // Join user-specific room for targeted updates
    // socket.join(`user:${socket.userId}`);

    // Future: handle typing, presence, etc.
    // socket.on('typing', (blogId) => {
    //   socket.to(`blog:${blogId}`).emit('userTyping', socket.userId);
    // });

    socket.on('disconnect', () => {
      console.log('⚡ Client disconnected:', socket.id);
    });
  });
};
