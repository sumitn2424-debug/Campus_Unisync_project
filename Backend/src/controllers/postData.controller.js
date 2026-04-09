// handkle all data related logic here
const User = require("../models/user.model");
const createPostModel = require("../models/createPost.model");
const data = async (req, res) => {
   const decoded = req.user; // Access the decoded user information from the middleware
   try{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await createPostModel.find().
    populate("userId", "username image").
    sort({ createdAt: -1 }).
    skip((page - 1) * limit).
    limit(limit);
    // console.log(posts);
    res.status(200).
    json(posts);
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
    const users = await User.find({}, "_id username");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = { data, getAllUsers };