const uploadFile = require("../services/storage.service");
const purchaseModel = require("../models/purchase.model");

// ✅ Create product post
const createPurchase = async (req, res) => {
    const decoded = req.user;
    console.log("Decoded user from middleware:", req.user);

    if (!decoded.isVerified) {
        return res.status(400).json({ message: "Please verify your email first" });
    }

    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        const { productName, productDescription, price } = req.body;

        if (!productName || !productDescription || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const parsedPrice = parseInt(price);

        let imageUrl = null;
        if (!req.file) {
            console.log("❌ FILE NOT RECEIVED");
            return res.status(400).json({ message: "Image missing" });
        }
        // ✅ check file exists
        if (req.file) {
            console.log("file recieved")
            const uploadResult = await uploadFile(
                req.file.buffer.toString("base64")
            );
            imageUrl = uploadResult.url;
        }

        const newPurchase = new purchaseModel({
            userId: decoded._id,
            productName,
            productDescription,
            price: parsedPrice,
            productImage: imageUrl,
        });

        await newPurchase.save();

        res.status(201).json({
            message: "Purchase created successfully!",
            purchase: newPurchase,
        });

    } catch (err) {
        console.error("🔥 REAL ERROR:", err); // ✅ VERY IMPORTANT
        res.status(500).json({
            message: err.message,
        });
    }
};

// ✅ Show product list (pagination & filtering)
const showPurchase = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const userId = req.query.userId; // Filter by user if provided

    try {
        const query = userId ? { userId } : {};

        const purchases = await purchaseModel
            .find(query)
            .populate("userId", "username image")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            message: "Purchases list retrieved",
            data: purchases,
        });

    } catch (error) {
        console.error("purchases list error:", error);

        res.status(500).json({
            message: "Failed to load purchases",
            error: error.message,
        });
    }
};

// ✅ Delete product post
const deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id;

        const purchase = await purchaseModel.findById(id);

        if (!purchase) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Verify ownership or Admin role
        if (purchase.userId.toString() !== currentUserId.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete this product" });
        }

        await purchaseModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Product deleted successfully",
        });

    } catch (err) {
        console.error("Delete purchase error:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createPurchase,
    showPurchase,
    deletePurchase,
};