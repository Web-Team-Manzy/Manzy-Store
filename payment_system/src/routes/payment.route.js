const express = require("express");
const router = express.Router();

const paymentController = require("../app/controllers/payment.controller");
const serviceAuth = require("../middleware/serviceAuth");

router.post("/create-account", serviceAuth, paymentController.createAccount);

module.exports = router;
