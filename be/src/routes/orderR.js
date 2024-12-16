const express = require("express");
const router = express.Router();
const orderC = require("../app/controllers/orderC");

// Admin Features
router.post('/status', orderC.updateStatus);
router.post('/list', orderC.allOrders);

// Payment features
router.post('/place', orderC.placeOrder);

// User Features
router.post('/userOrders', orderC.userOrders);

module.exports = router;