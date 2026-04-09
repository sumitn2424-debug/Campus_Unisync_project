const Message = require("../models/message.model");
const users = {}; // { userId: socketId }

const handleChatMessages = (socket, io) => {
  socket.on("user_connected", (userId) => {
    if (!userId) return;
    users[userId] = socket.id;
    io.emit("online_users", Object.keys(users));
    console.log("User connected in socket service. UserID:", userId, "Socket ID:", socket.id);
  });

  socket.on("send_message", async ({ senderId, receiverId, text }) => {
    console.log("Received send_message event:", { senderId, receiverId, text });
    if (!senderId || !receiverId || !text) {
      console.log("Validation failed: missing fields");
      return;
    }

    try {
      const newMessage = await Message.create({ senderId, receiverId, text });
      console.log("Message created in DB:", newMessage._id);

      // Send to receiver if online
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        console.log("Receiver is online, emitting to receiver socket:", receiverSocketId);
        io.to(receiverSocketId).emit("receive_message", newMessage);
      } else {
        console.log("Receiver is completely offline. Not in users map.");
      }

      // Send to sender to confirm
      console.log("Emitting back to sender socket:", socket.id);
      socket.emit("receive_message", newMessage);
    } catch (err) {
      console.error("Socket error processing sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    for (let id in users) if (users[id] === socket.id) delete users[id];
    io.emit("online_users", Object.keys(users));
  });
};

module.exports = { handleChatMessages };