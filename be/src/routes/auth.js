const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/AuthController");

const auth = require("../middleware/auth");

router.post("/comfirmation-pin", authController.sendEmailConfirmationPin);

router.post("/register", authController.register);

router.post("/login", authController.handleLogin);

router.post("/login/google", authController.handleLoginGoogle);

router.post("/login/facebook", authController.handleLoginFacebook);

router.post("/logout", auth, authController.handleLogout);

router.get("/account", auth, authController.getUserAccount);

module.exports = router;
