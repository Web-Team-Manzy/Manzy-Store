const express = require("express");
const router = express.Router();

const transactionController = require("../app/controllers/transaction.controller");
const serviceAuth = require("../middleware/serviceAuth");

router.post("/create-transaction", serviceAuth, transactionController.createTransaction);

router.get("/", serviceAuth, transactionController.getTransactions);

module.exports = router;
