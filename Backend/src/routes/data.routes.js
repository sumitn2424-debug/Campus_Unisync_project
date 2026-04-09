
const router = require("express").Router();
const { data } = require("../controllers/postData.controller");
const authUser = require("../middleware/authData.middleware");



router.get("/fetchPosts",authUser, data);

module.exports = router;