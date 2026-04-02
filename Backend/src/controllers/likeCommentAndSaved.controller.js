const createPostModel = require("../models/createPost.model");
const commentModel = require("../models/comment.model");
const savePost = require("../models/save.model");
const like = require("../models/like.model");


// Like or Unlike a Post
const likePosts = async (req, res) => {
    const decoded = req.user;
    postId = req.params.id;
    // console.log(`   Post ID: ${postId}`);
    // console.log(`Decoded User ID: ${decoded.id}`);
    try {
        const post = await createPostModel.findById(postId);
        if (!post) {
            console.log(`Post with ID ${postId} not found.`);
            return res.status(404).json({ message: "Post not found" })
        }
        const likeDoc = await like.findOne({ postId });
        if (!likeDoc) {
            const newLikeDoc = new like({
                userId: decoded.id,
                postId: postId,
                likes: [decoded.id]
            });
            await newLikeDoc.save();
            return res.status(200).json({
                message: "Post liked",
                data: post,
                likeCount: 1
            }); 
        }

        const isliked = likeDoc.likes.includes(decoded.id);
        if (isliked) {
            likeDoc.likes = likeDoc.likes.filter(id => id.toString() !== decoded.id.toString());
        } else {
            likeDoc.likes.push(decoded.id);
        }

        await likeDoc.save();

        res.status(200).json({
            message: isliked ? "Post unliked" : "Post liked",
            data: post,
            likeCount: likeDoc.likes.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message , message2:"Please login again" });
        console.error("Error liking/unliking post:", err);
    }
}

// Save or Unsave a Post
const savePosts = async (req, res) => {
    const decoded = req.user;
    postId = req.params.id;
    try {
        const post = await createPostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        const postSavedModel = await savePost.findOne({ postId });
        if (!postSavedModel) {
            const newPostSavedModel = new savePost({
                userId: post.id,
                postId: postId,
                savedBy: [decoded.id]
            });
            await newPostSavedModel.save();
            return res.status(200).json({
                message: "Post saved",
                data: newPostSavedModel,
                saveCount: 1
            });
        }

        const isSaved = postSavedModel.savedBy.includes(decoded.id);
        if (isSaved) {
            postSavedModel.savedBy = postSavedModel.savedBy.filter(id => id.toString() !== decoded.id.toString());
        } else {
            postSavedModel.savedBy.push(decoded.id);
        }
        await postSavedModel.save();
        res.status(200).json({
            message: isSaved ? "Post unsaved" : "Post saved",
            data: postSavedModel,
            saveCount: postSavedModel.savedBy.length
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error("Error saving/unsaving post:", err);
    }

}

// get savee posts of a user
const getSavedPosts = async (req, res) => {
    const decoded = req.user;
    try {
        const savedPosts = await savePost.find({ savedBy: decoded.id });
        res.status(200).json({
            message: "Saved posts retrieved successfully",
            data: savedPosts
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//Post a comment
const commentOnPost = async (req, res) => {
    const decoded = req.user;
    const { content } = req.body;
    const postId = req.params.id;
    console.log(`content : ${req.body.content}`);
    try {
        const comments = await commentModel.findById(postId);
        if (comments) {
            console.log(`you already commented on this post`);
            return res.status(404).json({ message: "You have already commented on this post" });
        }

        const comment = new commentModel({
            userId: decoded.id,
            postId: postId,
            content: content,
        });

        await comment.save();

        res.status(201).json({
            message: "Comment added successfully",
            data: comment
        });
    } catch (err) {
        res.status(500).json({ message: err.message , message2:"Please login again"});
        console.error("Error commenting on post:", err);
    }
};

// Delete a comment (Optional, not implemented in routes yet)
const deleteComment = async (req, res) => {
    const decoded = req.user;
    const commentId = req.params.commentId;

    try {
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== decoded.id.toString()) {
            return res.status(403).json({ message: "You are not the owner of this comment" });
        }

        await commentModel.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { likePosts, savePosts, commentOnPost, deleteComment, getSavedPosts };