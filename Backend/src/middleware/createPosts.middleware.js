
const jwt = require("jsonwebtoken");
const createPostMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    // const token = req.headers.authorization?.split(' ')[1];
    try{
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.isVerified === false){
            console.log(decoded._id);
            return res.status(400).json({message:"Please verify your email first"})
        }
        req.user = decoded;
        next();
    }catch(err){
        res.status(500).json({message:err.message,
            messatge2:"Please login again"
        })
    }
}

module.exports = createPostMiddleware;