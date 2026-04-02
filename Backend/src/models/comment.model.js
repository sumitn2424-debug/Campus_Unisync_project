const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreatePost', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;