const Message = require("../models/message.model");
const users = {}; // { userId: socketId }

const handleChatMessages = (socket, io) => {
  socket.on("user_connected", (userId) => {
    if (!userId) return;
    users[userId] = socket.id;
    io.emit("online_users", Object.keys(users));
    console.log("Online users:", users);
  });

  socket.on("send_message", async ({ senderId, receiverId, text }) => {
    if (!senderId || !receiverId || !text) return;

    try {
      const newMessage = await Message.create({ senderId, receiverId, text });

      // Send to receiver if online
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) io.to(receiverSocketId).emit("receive_message", newMessage);

      // Send to sender to confirm
      socket.emit("receive_message", newMessage);
    } catch (err) {
      console.error("Socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    for (let id in users) if (users[id] === socket.id) delete users[id];
    io.emit("online_users", Object.keys(users));
  });
};

module.exports = { handleChatMessages };