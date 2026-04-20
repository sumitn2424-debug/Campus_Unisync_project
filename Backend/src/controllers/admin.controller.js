// src/controllers/admin.controller.js
const UserModel = require("../models/user.model");
const postModel = require("../models/createPost.model");
const purchaseModel = require("../models/purchase.model");

// ✅ Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, "-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Delete any user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting yourself (admin safety)
        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot delete your own admin account." });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Delete all user content first (optional but recommended)
        await postModel.deleteMany({ userId: id });
        await purchaseModel.deleteMany({ userId: id });
        
        await UserModel.findByIdAndDelete(id);

        res.status(200).json({ message: "User and all associated content deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get Platform Stats
const getStats = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalPosts = await postModel.countDocuments();
        const totalProducts = await purchaseModel.countDocuments();

        res.status(200).json({
            users: totalUsers,
            posts: totalPosts,
            products: totalProducts
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Approve user
const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndUpdate(id, { status: "approved" }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User approved successfully.", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Reject user
const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User rejected successfully.", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getStats,
    approveUser,
    rejectUser
};
