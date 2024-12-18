const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/AuthController");

router.post("/register", authController.register);

router.post("/login", authController.handleLogin);

router.post("/login/google", authController.handleLoginGoogle);

router.post("/logout", authController.handleLogout);

router.get("/account", authController.getUserAccount);

module.exports = router;
