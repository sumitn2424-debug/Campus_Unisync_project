const express = require("express");
const router = express.Router();
const likeCommentAndSavedMiddleware = require("../middleware/likeCommentAndSaved.middleware");
const likeCommentAndSavedController = require("../controllers/likeCommentAndSaved.controller");



router.post("/like/:id", likeCommentAndSavedMiddleware, likeCommentAndSavedController.likePosts);
router.post("/save/:id", likeCommentAndSavedMiddleware, likeCommentAndSavedController.savePosts);
router.post("/comment/:id", likeCommentAndSavedMiddleware, likeCommentAndSavedController.commentOnPost);
router.delete("/d-comment/:commentId", likeCommentAndSavedMiddleware, likeCommentAndSavedController.deleteComment);
router.get("/saved-posts", likeCommentAndSavedMiddleware, likeCommentAndSavedController.getSavedPosts);

module.exports = router;