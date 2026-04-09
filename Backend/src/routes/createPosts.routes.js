const express = require('express');
const router = express.Router();
const multer = require("multer");
const Post  = require("../controllers/createPosts.controller");
const createPostMiddleware = require('../middleware/createPosts.middleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-Post", upload.single("image"), createPostMiddleware, Post.createPost);
router.delete("/delete-Post/:id", createPostMiddleware, Post.deletePost);
module.exports = router;