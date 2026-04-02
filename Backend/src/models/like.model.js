const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData", required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "CreatePost", required: true },
    likes:[ { type: mongoose.Schema.Types.ObjectId, ref: "UserData" } ],
    savedBy:[ { type: mongoose.Schema.Types.ObjectId, ref: "UserData" } ],
});

const likeModel = mongoose.model("Like", likeSchema); 

module.exports = likeModel;