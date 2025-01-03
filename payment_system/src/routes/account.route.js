const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/account.controller");
const serviceAuth = require("../middleware/serviceAuth");

router.post("/create-account", serviceAuth, accountController.createAccount);

router.get("/get-balance", serviceAuth, accountController.getBalance);

module.exports = router;
