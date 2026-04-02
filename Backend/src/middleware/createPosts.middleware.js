
const jwt = require("jsonwebtoken");
const createPostMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    try{
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.status(500).json({message:err.message,
            messatge2:"Please login again"
        })
    }
}

module.exports = createPostMiddleware;