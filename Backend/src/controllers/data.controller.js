// handkle all data related logic here

const createPostModel = require("../models/createPost.model");
const data = async (req, res) => {
   const decoded = req.user; // Access the decoded user information from the middleware
   try{
    const posts = await createPostModel.find().limit(20).sort({createdAt:-1});
    console.log(decoded.username);
    res.status(200).
    json(
        {  
            message: "Data retrieved successfully",
            data: posts ,
            username: decoded.username,
        });
   }catch(err){
    res.status(500).json({message:err.message,
        nessage2:"Please login again"
    })
   }
}

module.exports = { data };