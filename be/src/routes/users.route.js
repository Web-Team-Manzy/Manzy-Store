const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserController");
const isAdmin = require("../middleware/isAdmin");

// Get all users
router.get("/", isAdmin, userController.index);

// Get user by id
router.get("/:id", isAdmin, userController.show);

// Update user by id
router.put("/:id", isAdmin, userController.update);

// Delete user by id
router.delete("/:id", isAdmin, userController.destroy);

module.exports = router;
