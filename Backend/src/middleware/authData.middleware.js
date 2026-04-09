const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) =>{
    const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized", message2:"No token provided" });
        }
    try{
          
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(decoded._id)
        next();
    }catch(err){
        res.status(401).json({message:"Unauthorized", message2:err.message});
    }
}

module.exports = authUser;