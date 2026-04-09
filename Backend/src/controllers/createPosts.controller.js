const createPostModel = require("../models/createPost.model");
const uploadFile = require("../services/storage.service")


//create post
const createPost = async(req, res) => {
    const decoded = req.user; // Get user info from auth middleware
    // console.log(req.user)
    // console.log("Decoded user from middleware:", req.user);
    if(!decoded.isVerified){
        return res.status(400).json({message:"Please verify your email first"})
    }
    try{
        const {title, description} = req.body;

        let imageUrl = "";
        if (req.file) {
            const uplaadResult = await uploadFile(req.file.buffer.toString("base64"));
            imageUrl = uplaadResult.url;
        }

        const newPostData = new createPostModel({
            userId: decoded._id || decoded.id,
            title: title,
            description: description,
            image: imageUrl,
        })
        await newPostData.save();

        res.status(201).json({message:"Post created successfully", data: newPostData});
    }catch(err){
        res.status(500).json({message:err.message})
    }
}


//delete post
const deletePost = async(req, res) => {
    const decoded = req.user;
    try{
        const postId = req.params.id;
        const post = await createPostModel.findById(postId);
        
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        // Robust ID checking: convert both to string for comparison
        const isOwner = post.userId.toString() === (decoded._id || decoded.id).toString();
        const isAdmin = decoded.role === "admin";

        if(!isOwner && !isAdmin){
            return res.status(403).json({message:"Forbidden: You are not authorized to delete this post"});
        }

        await post.deleteOne();
        res.status(200).json({message:"Post deleted successfully"});

    }catch(err){
        res.status(500).json({message:err.message})
        // console.log(err.message)
    }
}


module.exports = { createPost, deletePost };