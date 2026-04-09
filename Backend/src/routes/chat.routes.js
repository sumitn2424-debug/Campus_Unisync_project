const express = require("express");
const router = express.Router();
const { getMessages, markAsRead, getUnreadCounts } = require("../controllers/chat.controller");

router.get("/messages", getMessages);
router.post("/mark-read", markAsRead);
router.get("/unread-counts", getUnreadCounts);

module.exports = router;