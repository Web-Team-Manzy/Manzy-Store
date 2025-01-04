const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/account.controller");
const serviceAuth = require("../middleware/serviceAuth");

router.post("/create-account", serviceAuth, accountController.createAccount);

router.post("/get-balance", serviceAuth, accountController.getBalance);

router.get("/get-main-account", serviceAuth, accountController.getMainAccount);

module.exports = router;
