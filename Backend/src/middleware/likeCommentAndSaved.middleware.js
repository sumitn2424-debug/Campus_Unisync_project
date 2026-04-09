const jwt = require("jsonwebtoken"); // ✅ ADD THIS

const likeCommentAndSavedMiddleware = async (req, res, next) => {
    console.log("COOKIES:", req.cookies);

    const token = req.cookies.token;

    try {
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED:", decoded); // ✅ debug

        req.user = decoded;
        next();

    } catch (err) {
        console.log("🔥 JWT ERROR:", err.message);

        res.status(401).json({
            message: "Invalid token",
            message2: "Please login again"
        });
    }
};

module.exports = likeCommentAndSavedMiddleware;