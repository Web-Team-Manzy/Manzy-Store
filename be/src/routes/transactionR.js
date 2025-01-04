const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const transactionController = require("../app/controllers/transactionC");

// Get transactions

router.get("/", auth, isAdmin, transactionController.getTransactions);

module.exports = router;