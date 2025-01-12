const express = require("express");
const router = express.Router();
const orderC = require("../app/controllers/orderC");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const serviceAuth = require("../middleware/serviceAuth");

// Admin Features
router.post("/status", auth, isAdmin, orderC.updateStatus);
router.post("/list", auth, isAdmin, orderC.allOrders);

// Payment features
router.post("/confirmation-pin", auth, orderC.sendOrderConfirmationPin);
router.post("/place", auth, orderC.placeOrder);

// User Features
router.post("/userOrders", auth, orderC.userOrders);

// Api for payment system
router.get("/:startDate/:endDate", serviceAuth, orderC.getOrdersByDate);

module.exports = router;
