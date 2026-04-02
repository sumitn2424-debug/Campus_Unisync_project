const express = require('express');
const router = express.Router();
const multer = require("multer");
const createPost  = require("../controllers/createPosts.controller");
const createPostMiddleware = require('../middleware/createPosts.middleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-Post",createPostMiddleware, upload.single("image"), createPost);

module.exports = router;