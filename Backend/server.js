const { connectDB } = require('./src/db/db'); // ✅ FIXED
require('dotenv').config();
const app = require('./src/app');
const http = require("http");
const { Server } = require("socket.io");


connectDB();

const server = http.createServer(app);

// Attach socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
console.log("this is the server file") // ✅ FIXED
const PORT = process.env.PORT || 5001;

// Socket logic
let users = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log(`this is the user: ${users[userId]}`);
  });

  socket.on("send_message", ({ senderId, receiverId, message }) => {
    const receiverSocket = users[receiverId];
    console.log(`this is reciever id ${receiverId} and this is sender id ${senderId}`);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server running with Socket.IO");
});