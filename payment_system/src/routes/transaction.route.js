const express = require("express");
const router = express.Router();

const transactionController = require("../app/controllers/transaction.controller");

router.post("/create-transaction", transactionController.createTransaction);

module.exports = router;
