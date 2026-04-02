// hanndle all sell and buy related logic here

const uploadFile = require("../services/storage.service");
const purchaseModel = require("../models/puchase.model");

const purchaseRouter = async(req, res) => {
    const decoded = req.user; // Access the decoded user information from the middleware
    if(!decoded.isVerified){
        return res.status(400).json({message:"Please verify your email first"})
    }
    try{

        const {productName, productDescription, price} = req.body;
        const uploadResult = await uploadFile(req.file.buffer.toString("base64"));
        // console.log(req.file.buffer);
        const newPurchase = new purchaseModel({
            userId: decoded.id,
            username: decoded.username,
            productName: productName,
            productDescription:productDescription,
            price:price,
            productImage: uploadResult.url // Assuming the storage service returns an object with a 'url' property
        });
        await newPurchase.save();
        res.status(201).json({ message: "Purchase created successfully!", purchase: newPurchase });

    }catch(err){
        res.status(500).json({message:err.message,
            nessage2:"Please login again"
        })
    }
}   

module.exports =  purchaseRouter ;