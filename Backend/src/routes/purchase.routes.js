const express = require("express");
const router = express.Router();

const { createPurchase, showPurchase } = require("../controllers/purchase.controller");
const authUser = require("../middleware/authData.middleware");

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/product", authUser, upload.single("image"), createPurchase);
router.get("/products", authUser, showPurchase);

module.exports = router;