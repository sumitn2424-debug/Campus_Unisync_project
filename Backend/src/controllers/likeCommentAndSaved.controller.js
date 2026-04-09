const createPostModel = require("../models/createPost.model");
const commentModel = require("../models/comment.model");
const savePost = require("../models/save.model");
const like = require("../models/like.model");


// Like or Unlike a Post
const likePosts = async (req, res) => {
    const decoded = req.user._id;
    const userId = decoded.toString();
    const postId = req.body.postId;
    console.log("route loaded")
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
                userId: userId,
                postId: post._id,
                likes: [userId]
            });
            await newLikeDoc.save();
            return res.status(200).json({
                message: "Post liked",
                data: post,
                likeCount: 1
            });
        }

        const isliked = likeDoc.likes.includes(userId);
        if (isliked) {
            likeDoc.likes = likeDoc.likes.filter(id => id.toString() !== userId);
        } else {
            likeDoc.likes.push(userId);
        }

        await likeDoc.save();

        res.status(200).json({
            message: isliked ? "Post unliked" : "Post liked",
            data: post,
            likeCount: likeDoc.likes.length,
            isLiked: !isliked
        });
    } catch (err) {
        console.log("backend error", err);
        res.status(500).json({ message: err.message, message2: "Please login again" });
        console.error("Error liking/unliking post:", err);
    }
}

// Save or Unsave a Post
const savePosts = async (req, res) => {
    const decoded = req.user._id;
    const userId = decoded.toString();
    const postId = req.body.postId;
    try {
        const post = await createPostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        const postSavedModel = await savePost.findOne({ postId });
        if (!postSavedModel) {
            const newPostSavedModel = new savePost({
                userId: post.userId,
                postId: post._id,
                savedBy: [userId]
            });
            await newPostSavedModel.save();
            return res.status(200).json({
                message: "Post saved",
                data: newPostSavedModel,
                saveCount: 1
            });
        }

        const isSaved = postSavedModel.savedBy.includes(userId);
        if (isSaved) {
            postSavedModel.savedBy = postSavedModel.savedBy.filter(id => id.toString() !== userId);
        } else {
            postSavedModel.savedBy.push(userId);
        }
        await postSavedModel.save();
        res.status(200).json({
            message: isSaved ? "Post unsaved" : "Post saved",
            data: postSavedModel,
            isSaved: !isSaved,  
            saveCount: postSavedModel.savedBy.length
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error("Error saving/unsaving post:", err);
    }

}

// get savee posts of a user
const getSavedPosts = async (req, res) => {
    const decoded = req.user._id;
    const userId = decoded.toString();
    try {
        const savedPosts = await savePost.find({ savedBy: userId });
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
    const decoded = req.user._id;
    const userId = decoded.toString();
    const { content } = req.body;
    const postId = req.body.postId;
    console.log(`content : ${req.body.content}`);
    try {
        const comments = await commentModel.findOne({  userId,postId });
        if (comments) {
            // console.log(`you already commented on this post`);
            return res.status(404).json({ message: "You have already commented on this post" });
        }

        const comment = new commentModel({
            userId: userId,
            postId: postId,
            content: content,
        });

        await comment.save();

        res.status(201).json({
            message: "Comment added successfully",
            data: comment
        });
    } catch (err) {
        res.status(500).json({ message: err.message, message2: "Please login again" });
        console.error("Error commenting on post:", err);
    }
};

// Delete a comment (Optional, not implemented in routes yet)
const deleteComment = async (req, res) => {
    const decoded = req.user._id;
    const userId = decoded.toString();
    const commentId = req.body.postId;

    try {
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "You are not the owner of this comment" });
        }

        await commentModel.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { likePosts, savePosts, commentOnPost, deleteComment, getSavedPosts };