const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData", required: true },
    productName: { type: String, required: true },
    productDescription: { type: String },
    price: { type: Number, required: true },
    productImage: { type: String },
    purchaseDate: { type: Date, default: Date.now }
});

const purchaseModel = mongoose.model("Purchase", purchaseSchema);

module.exports = purchaseModel;