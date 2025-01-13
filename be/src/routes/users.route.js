const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Get all users
router.get("/", auth, isAdmin, userController.index);

// Get user by id
router.get("/:id", auth, userController.show);

// Get user balance
router.get("/:id/balance", auth, userController.getBalance);

// Update user by id
router.put("/:id", auth, userController.update);

// Delete user by id
router.delete("/:id", auth, isAdmin, userController.destroy);

router.post("/send", userController.sendFormData);

module.exports = router;
