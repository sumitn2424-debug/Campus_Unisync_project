
const router = require("express").Router();
const { data } = require("../controllers/data.controller");
const authUser = require("../middleware/authData.middleware");



router.get("/fetchData",authUser, data);

module.exports = router;