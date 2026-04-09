const Message = require("../models/message.model");

const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    if (!senderId || !receiverId) return res.status(400).json({ message: "Missing IDs" });

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    await Message.updateMany(
      { senderId, receiverId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUnreadCounts = async (req, res) => {
  try {
    const { userId } = req.query;
    const unreadMessages = await Message.aggregate([
      { $match: { receiverId: userId, isRead: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } }
    ]);
    
    // Convert to a simple object { senderId: count }
    const counts = {};
    unreadMessages.forEach(item => {
      counts[item._id] = item.count;
    });
    
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMessages, markAsRead, getUnreadCounts };