const express = require("express");
const router = express.Router();
const likeCommentAndSavedMiddleware = require("../middleware/likeCommentAndSaved.middleware");
const likeCommentAndSavedController = require("../controllers/likeCommentAndSaved.controller");



router.post("/like", likeCommentAndSavedMiddleware, likeCommentAndSavedController.likePosts);
router.post("/save", likeCommentAndSavedMiddleware, likeCommentAndSavedController.savePosts);
router.post("/comment", likeCommentAndSavedMiddleware, likeCommentAndSavedController.commentOnPost);
router.delete("/d-comment", likeCommentAndSavedMiddleware, likeCommentAndSavedController.deleteComment);
router.get("/saved-posts", likeCommentAndSavedMiddleware, likeCommentAndSavedController.getSavedPosts);

module.exports = router;