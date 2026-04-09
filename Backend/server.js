require('dotenv').config();
const { connectDB } = require('./src/db/db'); // ✅ FIXED
const app = require('./src/app');
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require('./src/config/socket');
require("./src/jobs/deleteUnverifiedUsers");

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

socketHandler(io); // Initialize socket handlers
console.log("this is the server file") // ✅ FIXED
const PORT = process.env.PORT || 5001;


server.listen(PORT, () => {
  console.log("Server running with Socket.IO", PORT);
});