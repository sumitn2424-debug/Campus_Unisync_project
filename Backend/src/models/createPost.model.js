const mongoose = require("mongoose");

const createPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData", required: true },
    image: { type: String },
    title: { type: String, required: true },
    description: { type: String},
    createdAt: { type: Date, default: Date.now }
});

const createPostModel = mongoose.model("CreatePost", createPostSchema);

module.exports = createPostModel;