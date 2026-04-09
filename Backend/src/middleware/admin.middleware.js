// src/middleware/admin.middleware.js

const isAdmin = (req, res, next) => {
    // req.user is populated by authData.middleware
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ 
            message: "Access denied. Admin authority required." 
        });
    }
    next();
};

module.exports = isAdmin;
