const createPostModel = require("../models/createPost.model");
const uploadFile = require("../services/storage.service")

const createPost = async(req, res) => {
    const decoded = req.user; // Get user info from auth middleware
    if(!decoded.isVerified){
        return res.status(400).json({message:"Please verify your email first"})
    }
    try{
        const {title, description} = req.body;

        const uplaadResult = await uploadFile(req.file.buffer.toString("base64"));
        // console.log(req.file.buffer);
        console.log("Upload Result:", uplaadResult);
        const newPostData = new createPostModel({
            userId: decoded.id,
            username: decoded.username,
            title: title,
            description: description,
            image: uplaadResult.url,
        })
        await newPostData.save();
        res.status(201).json({message:"Post created successfully", data: newPostData});
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

module.exports = createPost ;