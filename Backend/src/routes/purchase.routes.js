const express = require("express");
const router = express.Router();
const  purchaseRoute  = require("../controllers/purchase.controller");
const authUser = require("../middleware/authData.middleware");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/product", authUser, upload.single("productImage"), purchaseRoute);  

module.exports = router;