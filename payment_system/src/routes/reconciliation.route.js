const express = require("express");
const router = express.Router();

const ReconciliationController = require("../app/controllers/reconciliation.controller");

router.get("/", ReconciliationController.reconcileTransaction);

router.get("/discrepancy", ReconciliationController.getDiscrepancyReport);

router.post("/send-report", ReconciliationController.sendReport);

module.exports = router;
