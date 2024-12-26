const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserController");

// Get all users
router.get("/", userController.index);

module.exports = router;
