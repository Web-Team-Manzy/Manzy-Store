const express = require("express");
const router = express.Router();

const paymentController = require("../app/controllers/payment.controller");

router.post("/create-account", paymentController.createAccount);

module.exports = router;
