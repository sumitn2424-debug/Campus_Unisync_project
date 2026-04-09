const socketServiceHandler = require('../services/socket.service');
const socketService = (io) => {
  io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // Call socket service functions
    socketServiceHandler.handleChatMessages(socket, io);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketService;