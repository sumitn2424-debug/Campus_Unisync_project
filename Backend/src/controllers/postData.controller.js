// handkle all data related logic here
const User = require("../models/user.model");
const createPostModel = require("../models/createPost.model");
const data = async (req, res) => {
   const decoded = req.user; // Access the decoded user information from the middleware
   try{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.query.userId;
    
    // Add optional filter for specific user
    const query = userId ? { userId: userId } : {};

    const posts = await createPostModel.find(query).
    populate("userId", "username image").
    sort({ createdAt: -1 }).
    skip((page - 1) * limit).
    limit(limit);
    
    // Fetch counts and status for each post
    const likeModel = require("../models/like.model");
    const saveModel = require("../models/save.model");
    
    const currUserId = decoded ? (decoded._id || decoded.id) : null;

    const postsWithCounts = await Promise.all(posts.map(async (post) => {
        const likeDoc = await likeModel.findOne({ postId: post._id });
        const saveDoc = await saveModel.findOne({ postId: post._id });
        
        return {
            ...post.toObject(),
            likeCount: likeDoc ? likeDoc.likes.length : 0,
            saveCount: saveDoc ? saveDoc.savedBy.length : 0,
            isLiked: (likeDoc && currUserId) ? likeDoc.likes.includes(currUserId) : false,
            isSaved: (saveDoc && currUserId) ? saveDoc.savedBy.includes(currUserId) : false,
        };
    }));
    
    res.status(200).json(postsWithCounts);
   }catch(err){
    res.status(500).json({message:err.message,
        nessage2:"Please login again"
    })
   }
}

// ✅ Get all users except current user
// Get all users except current user
const getAllUsers = async(req, res) => {
  try {
    const users = await User.find({}, "_id username image");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = { data, getAllUsers };