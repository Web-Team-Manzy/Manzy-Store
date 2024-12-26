const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserController");

// Get all users
router.get("/", userController.index);

// Get user by id
router.get("/:id", userController.show);

// Update user by id
router.put("/:id", userController.update);

module.exports = router;
