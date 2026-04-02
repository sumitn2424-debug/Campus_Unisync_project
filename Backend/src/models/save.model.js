const mongoose = require('mongoose');

const postSaveSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreatePost', required: true },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }],
});

const postSavedModel = mongoose.model('postSaved', postSaveSchema);

module.exports = postSavedModel;