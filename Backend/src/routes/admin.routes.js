// src/routes/admin.routes.js
const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUser, getStats } = require("../controllers/admin.controller");
const authUser = require("../middleware/authData.middleware");
const isAdmin = require("../middleware/admin.middleware");

// All routes here require being logged in AND being an admin
router.use(authUser);
router.use(isAdmin);

router.get("/users", getAllUsers);
router.get("/stats", getStats);
router.delete("/user/:id", deleteUser);

module.exports = router;
